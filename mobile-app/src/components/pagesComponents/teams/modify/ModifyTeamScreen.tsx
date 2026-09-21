import {useRef, useState} from "react";
import {router, useLocalSearchParams} from "expo-router";
import {normalizeApiRequestError, printApiRequestError} from "@/src/services/errorService";
import {TeamDetails, TeamErrorFields, TeamUpdateRequest} from "@/src/services/teams/teamsConst";
import {checkTeamNameAlreadyExists, editTeam} from "@/src/services/teams/teamService";
import {SelectedImage} from "@/src/services/imagesService";
import ModifyTeamPage, {
    FIRST_STEP,
    LAST_STEP,
    STEPS,
    TeamEditStep
} from "@/src/components/pagesComponents/teams/modify/ModifyTeamPage";

// In questo componente
// si recuperano i valori della squadra v
// si tiene traccia degli errori
// collegamento con il service per modifica effettiva


export default function ModifyTeamScreen() {

    const submissionLock = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string>("");
    const [fieldErrors, setFieldErrors] = useState<TeamErrorFields>({});

    const params = useLocalSearchParams<{ team: string }>();

    const oldTeam = JSON.parse(params.team) as TeamDetails

    const [modTeamData, setModTeamData] = useState<TeamUpdateRequest>({
        name: oldTeam.name,
        description: oldTeam.description ?? "",
        status: oldTeam.status,
        location: oldTeam.location || null,
        imageUrl: undefined,
        sport: oldTeam.sport,
    });

    const [logo, setLogo] = useState<SelectedImage | null>(null);
    const [logoRemoved, setLogoRemoved] = useState(false);

    const [currentStep, setCurrentStep] = useState<TeamEditStep>(FIRST_STEP);

    //gestione logo
    function updateLogo(newLogo: SelectedImage | null) {
        setLogo(newLogo);
        setLogoRemoved(false);

        setModTeamData(previous => ({
            ...previous,
            newImageUrl: undefined,
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

        setModTeamData(previous => ({
            ...previous,
            newImageUrl: "REMOVE",
        }));

        setFieldErrors(previous => ({
            ...previous,
            logo: undefined,
        }));

        setApiError("");
    }

    function updateModTeamData<K extends keyof TeamUpdateRequest>(
        field: K,
        value: TeamUpdateRequest[K],
    ) {
        setModTeamData((previousData) => ({
            ...previousData,
            [field]: value,
        }));

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            [field]: undefined,
        }));

        setApiError("");
    }


    //validazioni
    async function validateForm(): Promise<boolean> {
        for (const step of STEPS) {
            if (!(await validateStep(step))) {
                setCurrentStep(step);
                return false;
            }
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

    async function validateNameAndDescription(): Promise<boolean> {

        const trimmedName = (modTeamData.name ?? "").trim();
        const trimmedDescription = modTeamData.description?.trim() ?? "";

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

        if (nameError || descriptionError) {
            return false;
        }

        if (trimmedName === oldTeam.name.trim()) {
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
            } else {
                setFieldErrors((previousErrors) => ({
                    ...previousErrors,
                    name: "Errore nel check nome",
                }))
            }

            printApiRequestError(apiError)
            return false;
        }
    }

    function validateLocation(): boolean {
        const location = modTeamData.location;

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

    //navigazione fra steps
    async function handleNext() {
        if (submissionLock.current) return;

        submissionLock.current = true;
        setIsSubmitting(true);
        setApiError("");

        try {
            if (currentStep === LAST_STEP) {
                if (await validateForm()) {
                    await handleEditTeam();
                }
            } else if (await validateStep(currentStep)) {
                setCurrentStep(
                    previous => (previous + 1) as TeamEditStep
                );
            }
        } finally {
            submissionLock.current = false;
            setIsSubmitting(false);

        }
    }

    function handleBack() {
        if (submissionLock.current || currentStep === FIRST_STEP) {
            return;
        }

        setApiError("");
        setCurrentStep(previous => (previous - 1) as TeamEditStep);
    }


    async function handleEditTeam() {
        try {
            const request: TeamUpdateRequest = {
                ...modTeamData,
                name: (modTeamData.name ?? "").trim(),
                description: modTeamData.description?.trim() ?? "",
            };

            await editTeam(String(oldTeam.id), request, logo);
            router.back();
        } catch (error) {

            const apiError = normalizeApiRequestError(error);

            // Redirect già gestito da authenticatedFetch
            if (apiError.status === 401) {
                return;
            }

            setApiError(apiError.message);
        }
    }


    return (
        <ModifyTeamPage
            oldTeam={oldTeam}
            newTeam={modTeamData}
            logo={logo}
            logoRemoved={logoRemoved}
            currentStep={currentStep}
            fieldErrors={fieldErrors}
            apiError={apiError}
            isSubmitting={isSubmitting}
            onChangeField={updateModTeamData}
            onChangeLogo={updateLogo}
            onRemoveLogo={removeLogo}
            onBack={handleBack}
            onNext={handleNext}
        />
    );

}