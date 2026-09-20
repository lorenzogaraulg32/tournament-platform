import {ComponentProps, useRef, useState} from "react";
import {Image} from "expo-image";
import {View} from "react-native";
import {router} from "expo-router";
import {
    checkTeamNameAlreadyExists,
    editTeam,
    TeamCreationRequest,
    TeamUpdateRequest,
} from "@/src/services/teams/teamCreationService";
import {normalizeApiRequestError, printApiRequestError,} from "@/src/services/errorService";
import FormLayout from "@/src/components/common/forms/FormLayout";
import HeaderCreateTeam from "@/src/components/pagesComponents/teams/createTeam/HeaderCreateTeam";
import FormContent from "@/src/components/common/forms/FormContent";
import NameAndDescStep from "@/src/components/pagesComponents/teams/createTeam/steps/NameAndDescStep";
import FormProgressBar from "@/src/components/common/forms/FormProgressBar";
import PositionStep from "@/src/components/pagesComponents/teams/createTeam/steps/PositionStep";
import LogoStep from "@/src/components/pagesComponents/teams/createTeam/steps/LogoStep";
import {TeamDetails} from "@/src/services/teams/teamService";
import {SelectedImage} from "@/src/services/imagesService";

type TeamEditProps = {
    team: TeamDetails;
    // Passare una sorgente con URL assoluto e headers se il logo è protetto.
    existingLogoSource?: ComponentProps<typeof Image>["source"];
};

type TeamEditFieldErrors = {
    name?: string;
    description?: string;
    status?: string;
    location?: string;
    logo?: string;
};


type TeamEditStep = 0 | 1 | 2;

const FIRST_STEP: TeamEditStep = 0;
const LAST_STEP: TeamEditStep = 2;

const STEPS: TeamEditStep[] = [0, 1, 2];

export default function ModifyTeam({team}: TeamEditProps) {
    const [currentStep, setCurrentStep] =
        useState<TeamEditStep>(FIRST_STEP);

    const [teamData, setTeamData] = useState<TeamUpdateRequest>({
        name: team.name,
        description: team.description ?? "",
        status: team.status,
        location:
            team.latitude != null && team.longitude != null
                ? {
                    label: team.locationLabel ?? "",
                    latitude: team.latitude,
                    longitude: team.longitude,
                }
                : undefined,
    });

    const [logo, setLogo] = useState<SelectedImage | null>(null);
    const [logoRemoved, setLogoRemoved] = useState(false);

    const [fieldErrors, setFieldErrors] =
        useState<TeamEditFieldErrors>({});
    const [apiError, setApiError] = useState<string>("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const submissionLock = useRef(false);


    function updateTeamData<K extends keyof TeamCreationRequest>(
        field: K,
        value: TeamCreationRequest[K],
    ) {
        setTeamData((previousData) => ({
            ...previousData,
            [field]: value,
        }));

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            [field]: undefined,
        }));

        setApiError("");
    }

    // Validazione locale e controllo disponibilità del nome modificato.
    async function validateNameAndDescription(): Promise<boolean> {

        if (!teamData.name) {
            teamData.name = team.name
        }

        const trimmedName = teamData.name.trim();
        const trimmedDescription = teamData.description?.trim() ?? "";

        const nameError =
            trimmedName.length < 5 || trimmedName.length > 20
                ? "Il nome deve avere tra 5 e 20 caratteri"
                : undefined;

        const descriptionError =
            trimmedDescription.length > 160
                ? "La descrizione non può superare i 160 caratteri"
                : undefined;

        setApiError("");

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            name: nameError,
            description: descriptionError,
        }));

        if (nameError || descriptionError) {
            return false;
        }

        if (trimmedName === team.name.trim()) {
            return true;
        }

        try {
            await checkTeamNameAlreadyExists(trimmedName);

            return true;
        } catch (error) {
            const apiError = normalizeApiRequestError(error);

            // Redirect già gestito da authenticatedFetch
            if (apiError.status === 401) {
                return false;
            }

            if (apiError.status === 409 && apiError.code === "TEAM_NAME_ALREADY") {
                setFieldErrors((previousErrors) => ({
                    ...previousErrors,
                    name: apiError.message,
                }));

                return false;
            }

            setApiError(apiError.message);
            return false;
        }
    }

    function validateLocation(): boolean {
        const location = teamData.location;

        // Nessuna posizione: consentito
        if (!location) {
            return true;
        }

        // Posizione presente ma non valida
        if (
            !location.label?.trim() ||
            !Number.isFinite(location.latitude) ||
            !Number.isFinite(location.longitude)
        ) {
            setFieldErrors((previousErrors) => ({
                ...previousErrors,
                location: "La posizione selezionata non è valida",

            }));

            return false;
        }

        return true;
    }

    function validateLogo(): boolean {
        if (
            logo?.fileSize !== undefined &&
            logo.fileSize > 2 * 1024 * 1024
        ) {
            setFieldErrors((previousErrors) => ({
                ...previousErrors,
                logo: "Il logo non può superare i 2 MB",

            }));
            return false;
        }

        return true;
    }

    async function validateStep(step: TeamEditStep): Promise<boolean> {

        switch (step) {
            case 0:
                return await validateNameAndDescription();

            case 1:
                return validateLocation();

            case 2:
                return validateLogo();
        }
    }

    async function validateForm(): Promise<boolean> {
        for (const step of STEPS) {
            if (!(await validateStep(step))) {
                setCurrentStep(step);
                return false;
            }
        }

        return true;
    }

    function handleBack() {
        if (
            currentStep === FIRST_STEP ||
            submissionLock.current
        ) {
            return;
        }

        setApiError("");

        setCurrentStep(
            (currentStep - 1) as TeamEditStep,
        );
    }

    async function handleNext() {
        if (submissionLock.current) {
            return;
        }

        submissionLock.current = true;
        setIsSubmitting(true);
        setApiError("");

        try {
            if (currentStep === LAST_STEP) {
                await handleEditTeam();
            } else if (await validateStep(currentStep)) {
                setCurrentStep((currentStep + 1) as TeamEditStep);
            }
        } finally {
            submissionLock.current = false;
            setIsSubmitting(false);
        }
    }

    async function handleEditTeam() {
        if (!(await validateForm())) {
            return;
        }

        const selectedLocation = teamData.location;

        if (!teamData.name) {
            teamData.name = team.name
        }


        const request: TeamUpdateRequest = {
            name: teamData.name.trim(),
            description:
                teamData.description?.trim() || undefined,
            status: teamData.status,
            location: selectedLocation
                ? {
                    label: selectedLocation.label,
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                }
                : undefined,
            newImageUrl: teamData.newImageUrl,
        };

        try {
            await editTeam(
                String(team.id),
                request,
                logo
            );

            router.back();
        } catch (error) {

            const apiError = normalizeApiRequestError(error);

            // Redirect già gestito da authenticatedFetch
            if (apiError.status === 401) {
                return;
            }
            printApiRequestError(apiError);

            if (apiError.status === 409 && apiError.code === "TEAM_NAME_ALREADY") {
                setFieldErrors((previous) => ({
                    ...previous,
                    name: apiError.message,
                }));
                setCurrentStep(FIRST_STEP);
                return;
            }

            setApiError(apiError.message);
        }
    }

    function updateLogo(newLogo: SelectedImage | null) {
        setLogo(newLogo);
        setLogoRemoved(false);

        setTeamData(previous => ({
            ...previous,
            newLogoUrl: undefined,
        }));

        setFieldErrors(previous => ({
            ...previous,
            logo: undefined,
        }));

        setApiError("");
    }

    function removeLogo() {
        setLogo(null);
        setLogoRemoved(true);

        setTeamData(previous => ({
            ...previous,
            newLogoUrl: "REMOVE",
        }));

        setFieldErrors(previous => ({
            ...previous,
            logo: undefined,
        }));

        setApiError("");
    }

    function renderStep() {
        switch (currentStep) {
            case 0:
                return (
                    <NameAndDescStep
                        nameValue={teamData.name ?? team.name}
                        descValue={teamData.description ?? ""}
                        switchValue={teamData.status ?? team.status}
                        onChangeName={(name) =>
                            updateTeamData("name", name)
                        }
                        onChangeDesc={(description) =>
                            updateTeamData("description", description)
                        }
                        onChangeSwitch={(status) =>
                            updateTeamData("status", status)
                        }
                        errorMsgName={fieldErrors.name}
                        errorMsgDesc={fieldErrors.description}
                        editable={!isSubmitting}
                    />
                );

            case 1:
                return (
                    <PositionStep
                        value={teamData.location || undefined}
                        onChange={(newLocation) =>
                            updateTeamData("location", newLocation)
                        }
                        errorMessage={fieldErrors.location}
                    />
                );

            case 2:
                return (
                    <LogoStep
                        value={logo}
                        existingLogoSource={
                            logoRemoved ? undefined : (team.imageUrl || undefined)
                        }
                        onRemove={removeLogo}
                        onChange={updateLogo}
                        disabled={isSubmitting}
                        errorMessage={fieldErrors.logo}
                        local={logo !== null}
                    />
                );
        }
    }

    const formStep =
        currentStep === FIRST_STEP
            ? "first"
            : currentStep === LAST_STEP
                ? "last"
                : "middle";

    return (
        <FormLayout
            header={<HeaderCreateTeam/>}
            variant={"teams"}>
            <FormProgressBar
                step={currentStep + 1}
                totalSteps={STEPS.length}
            />

            <FormContent
                handleBack={handleBack}
                handleNext={handleNext}
                isSubmitting={isSubmitting}
                step={formStep}
                apiError={apiError}>
                <View pointerEvents={isSubmitting ? "none" : "auto"}>
                    {renderStep()}
                </View>
            </FormContent>
        </FormLayout>
    );
}