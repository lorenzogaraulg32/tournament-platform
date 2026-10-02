import {useRef, useState} from "react";
import {router, useLocalSearchParams} from "expo-router";
import {normalizeApiRequestError, printApiRequestError} from "@/src/services/errorService";
import {TeamDetails, TeamFormErrors, TeamUpdateRequest} from "@/src/services/teams/teamDTO";
import {checkTeamNameAlreadyExists, editTeam} from "@/src/services/teams/teamService";
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
    const [fieldErrors, setFieldErrors] = useState<TeamFormErrors>({});

    const params = useLocalSearchParams<{ team: string }>();

    const oldTeam = JSON.parse(params.team) as TeamDetails

    const [modTeamData, setModTeamData] = useState<TeamUpdateRequest>({
        name: oldTeam.name,
        description: oldTeam.description ?? "",
        status: oldTeam.status,
        location: oldTeam.location || null,
        sport: oldTeam.sport,
        logo: undefined
    });


    const [currentStep, setCurrentStep] = useState<TeamEditStep>(FIRST_STEP);

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

            case 3:
                return true
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
            modTeamData.logo?.fileSize !== undefined &&
            modTeamData.logo.fileSize > 2 * 1024 * 1024
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

            await editTeam(String(oldTeam.id), request);
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
            currentStep={currentStep}
            fieldErrors={fieldErrors}
            apiError={apiError}
            isSubmitting={isSubmitting}
            onChangeField={updateModTeamData}
            onBack={handleBack}
            onNext={handleNext}
        />
    );

}