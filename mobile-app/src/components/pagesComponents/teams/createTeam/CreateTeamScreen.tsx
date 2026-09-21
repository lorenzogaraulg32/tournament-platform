import {useRef, useState} from "react";
import {router} from "expo-router";

import {normalizeApiRequestError, printApiRequestError,} from "@/src/services/errorService";
import type {TeamCreationRequest, TeamErrorFields,} from "@/src/services/teams/teamsConst";
import {checkTeamNameAlreadyExists, createTeam,} from "@/src/services/teams/teamService";
import type {SelectedImage} from "@/src/services/imagesService";

import CreateTeamPage, {
    FIRST_STEP,
    LAST_STEP,
    STEPS,
    type TeamCreationStep,
} from "@/src/components/pagesComponents/teams/createTeam/CreateTeamPage";

export default function CreateTeamScreen() {
    const submissionLock = useRef(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<TeamErrorFields>({});

    const [currentStep, setCurrentStep] =
        useState<TeamCreationStep>(FIRST_STEP);

    const [teamData, setTeamData] = useState<TeamCreationRequest>({
        name: "",
        description: "",
        status: "CLOSED",
        location: null,
        sport: undefined,
    });

    const [logo, setLogo] = useState<SelectedImage | null>(null);

    // Aggiornamento campi

    function updateTeamData<K extends keyof TeamCreationRequest>(
        field: K,
        value: TeamCreationRequest[K],
    ) {
        setTeamData(previous => ({
            ...previous,
            [field]: value,
        }));

        setFieldErrors(previous => ({
            ...previous,
            [field]: undefined,
        }));

        setApiError("");
    }

    function updateLogo(newLogo: SelectedImage | null) {
        setLogo(newLogo);

        setFieldErrors(previous => ({
            ...previous,
            logo: undefined,
        }));

        setApiError("");
    }

    // Validazione

    async function validateForm(): Promise<boolean> {
        for (const step of STEPS) {
            if (!(await validateStep(step))) {
                setCurrentStep(step);
                return false;
            }
        }

        return true;
    }

    async function validateStep(
        step: TeamCreationStep,
    ): Promise<boolean> {
        switch (step) {
            case 0:
                return validateNameAndDescription();
            case 1:
                return validateLocation();
            case 2:
                return validateLogo();
            case 3:
                return validateSport();
        }
    }

    async function validateNameAndDescription(): Promise<boolean> {
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

        setFieldErrors(previous => ({
            ...previous,
            name: nameError,
            description: descriptionError,
        }));

        if (nameError || descriptionError) {
            return false;
        }

        try {
            await checkTeamNameAlreadyExists(trimmedName);
            return true;
        } catch (error) {
            const apiError = normalizeApiRequestError(error);

            // Redirect già gestito da authenticatedFetch.
            if (apiError.status === 401) {
                return false;
            }

            if (apiError.status === 409) {
                setFieldErrors(previous => ({
                    ...previous,
                    name: apiError.message,
                }));
            } else {
                printApiRequestError(apiError);
                setApiError(apiError.message);
            }

            return false;
        }
    }

    function validateLocation(): boolean {
        const location = teamData.location;

        const isValid =
            location === null ||
            (
                !!location.label?.trim() &&
                Number.isFinite(location.latitude) &&
                location.latitude >= -90 &&
                location.latitude <= 90 &&
                Number.isFinite(location.longitude) &&
                location.longitude >= -180 &&
                location.longitude <= 180
            );

        setFieldErrors(previous => ({
            ...previous,
            location: isValid
                ? undefined
                : "La posizione selezionata non è valida",
        }));

        return isValid;
    }

    function validateLogo(): boolean {
        const logoError =
            logo?.fileSize !== undefined &&
            logo.fileSize > 2 * 1024 * 1024
                ? "Il logo non può superare i 2 MB"
                : undefined;

        setFieldErrors(previous => ({
            ...previous,
            logo: logoError,
        }));

        return !logoError;
    }

    function validateSport(): boolean {
        const sportError = !teamData.sport
            ? "Seleziona uno sport"
            : undefined;

        setFieldErrors(previous => ({
            ...previous,
            sport: sportError,
        }));

        return !sportError;
    }

    // Navigazione tra step

    async function handleNext(): Promise<void> {
        if (submissionLock.current) {
            return;
        }

        submissionLock.current = true;
        setIsSubmitting(true);
        setApiError("");

        try {
            if (currentStep === LAST_STEP) {
                if (await validateForm()) {
                    await handleCreateTeam();
                }
            } else if (await validateStep(currentStep)) {
                setCurrentStep(
                    previous => (previous + 1) as TeamCreationStep,
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
        setCurrentStep(
            previous => (previous - 1) as TeamCreationStep,
        );
    }

    // Creazione

    async function handleCreateTeam(): Promise<void> {
        try {
            const request: TeamCreationRequest = {
                ...teamData,
                name: teamData.name.trim(),
                description: teamData.description?.trim() || undefined,
            };

            const response = await createTeam(request, logo);

            router.replace(`/teams/${response.id}`);
        } catch (error) {
            const apiError = normalizeApiRequestError(error);

            // Redirect già gestito da authenticatedFetch.
            if (apiError.status === 401) {
                return;
            }

            printApiRequestError(apiError);
            setApiError(apiError.message);
        }
    }

    return (
        <CreateTeamPage
            team={teamData}
            logo={logo}
            currentStep={currentStep}
            fieldErrors={fieldErrors}
            apiError={apiError}
            isSubmitting={isSubmitting}
            onChangeField={updateTeamData}
            onChangeLogo={updateLogo}
            onBack={handleBack}
            onNext={handleNext}
        />
    );
}