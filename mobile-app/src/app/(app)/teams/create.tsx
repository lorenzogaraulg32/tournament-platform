import {useState} from "react";
import {router} from "expo-router";
import {createTeam, TeamCreationRequest, TeamLogoUpload,} from "@/src/services/teams/teamCreationService";
import {normalizeApiRequestError, printApiRequestError,} from "@/src/services/errorService";
import FormLayout from "@/src/components/common/forms/FormLayout";
import HeaderCreateTeam from "@/src/components/pagesComponents/teams/createTeam/HeaderCreateTeam";
import FormContent from "@/src/components/common/forms/FormContent";
import NameAndDescStep from "@/src/components/pagesComponents/teams/createTeam/steps/NameAndDescStep";
import FormProgressBar from "@/src/components/common/forms/FormProgressBar";
import PositionStep from "@/src/components/pagesComponents/teams/createTeam/steps/PositionStep";
import LogoStep from "@/src/components/pagesComponents/teams/createTeam/steps/LogoStep";

type TeamCreationFieldErrors = {
    name?: string;
    description?: string;
    status?: string;
    location?: string;
    logo?: string;
};


type TeamCreationStep = 0 | 1 | 2;

const FIRST_STEP: TeamCreationStep = 0;
const LAST_STEP: TeamCreationStep = 2;

const STEPS: TeamCreationStep[] = [0, 1, 2];

export default function CreateTeam() {
    const [currentStep, setCurrentStep] =
        useState<TeamCreationStep>(FIRST_STEP);

    const [teamData, setTeamData] =
        useState<TeamCreationRequest>({
            name: "",
            description: "",
            status: "CLOSED",
            location: undefined,
        });

    const [logo, setLogo] = useState<TeamLogoUpload | null>(null);


    const [fieldErrors, setFieldErrors] =
        useState<TeamCreationFieldErrors>({});


    const [apiError, setApiError] = useState<string>("");

    const [isSubmitting, setIsSubmitting] = useState(false);

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

    //validazione puramente frontend
    function validateNameAndDescription(): boolean {
        const trimmedName = teamData.name.trim();
        const trimmedDescription =
            teamData.description?.trim() ?? "";

        const nameError =
            trimmedName.length < 5 || trimmedName.length > 20
                ? "Il nome deve avere tra 5 e 20 caratteri"
                : undefined;

        const descriptionError =
            trimmedDescription.length > 160
                ? "La descrizione non può superare i 160 caratteri"
                : undefined;

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            name: nameError,
            description: descriptionError,
        }));

        return !nameError && !descriptionError;
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
                position: "La posizione selezionata non è valida",

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

    function validateStep(step: TeamCreationStep,): boolean {

        switch (step) {
            case 0:
                return validateNameAndDescription();

            case 1:
                return validateLocation();

            case 2:
                return validateLogo();
        }
    }

    function validateForm(): boolean {
        for (const step of STEPS) {
            if (!validateStep(step)) {
                setCurrentStep(step);
                return false;
            }
        }

        return true;
    }

    function handleBack() {
        if (
            currentStep === FIRST_STEP ||
            isSubmitting
        ) {
            return;
        }

        setApiError("");

        setCurrentStep(
            (currentStep - 1) as TeamCreationStep,
        );
    }

    async function handleNext() {
        if (isSubmitting) {
            return;
        }

        setApiError("");

        if (!validateStep(currentStep)) {
            return;
        }

        if (currentStep === LAST_STEP) {
            await handleCreateTeam();
            return;
        }

        setCurrentStep(
            (currentStep + 1) as TeamCreationStep,
        );
    }

    async function handleCreateTeam() {
        console.log("Creating Team....")
        if (isSubmitting) {
            return;
        }

        setApiError("");

        if (!validateForm()) {
            setApiError("Form non valido!")
            return;
        }

        const selectedLocation = teamData.location;

        const request: TeamCreationRequest = {
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
        };

        try {
            setIsSubmitting(true);

            const response = await createTeam(
                request,
                logo
            );

            router.replace(`/teams/${response.id}`);
        } catch (error) {


            const apiError = normalizeApiRequestError(error);
            console.log("Errore rilevato nel catch!")
            // Redirect già gestito da authenticatedFetch
            if (apiError.status === 401) {
                return;
            }
            printApiRequestError(apiError)
            setApiError(apiError.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    function updateLogo(newLogo: TeamLogoUpload | null) {
        setLogo(newLogo);
        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            logo: undefined,
        }));
        setApiError("");
    }

    function renderStep() {
        switch (currentStep) {
            case 0:
                return (
                    <NameAndDescStep
                        nameValue={teamData.name}
                        descValue={teamData.description ?? ""}
                        switchValue={teamData.status}
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
                        value={teamData.location}
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
                        onChange={updateLogo}
                        disabled={isSubmitting}
                        errorMessage={fieldErrors.logo}
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
            variant={"team"}>
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
                {renderStep()}
            </FormContent>
        </FormLayout>
    );
}