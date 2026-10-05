import {useRef, useState} from "react";
import {router} from "expo-router";

import {normalizeApiRequestError,} from "@/src/services/errorService";
import type {TeamCreationRequest, TeamFormErrors,} from "@/src/services/teams/teamDTO";
import {checkTeamNameAlreadyExists, createTeam,} from "@/src/services/teams/teamService";

import CreateTeamPage, {
    FIRST_STEP,
    LAST_STEP,
    STEPS,
    type TeamCreationStep,
} from "@/src/components/pagesComponents/teams/createTeam/CreateTeamPage";
import {
    validateDescription,
    validateLocation,
    validateMedia,
    validateUniqueName
} from "@/src/components/common/forms/validator/validator";

export default function CreateTeamScreen() {
    const submissionLock = useRef(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<TeamFormErrors>({});

    const [currentStep, setCurrentStep] = useState<TeamCreationStep>(FIRST_STEP);

    const [teamData, setTeamData] = useState<TeamCreationRequest>({
        name: "",
        description: "",
        status: "CLOSED",
        location: null,
        sport: undefined,
        logo: null
    });

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
                return validateLocationLocal();
            case 2:
                return validateLogo();
            case 3:
                return validateSport();
        }
    }


    async function validateNameAndDescription(): Promise<boolean> {

        const trimmedName = teamData.name.trim();
        const trimmedDescription = teamData.description?.trim() ?? "";

        let nameError = undefined;


        try {
            nameError = await validateUniqueName(trimmedName, checkTeamNameAlreadyExists)
        } catch (error) {
            const apiError = normalizeApiRequestError(error)
            setApiError(apiError.message);
            return false;
        }

        const descriptionError = validateDescription(trimmedDescription)


        if (nameError || descriptionError) {
            setFieldErrors(previous => ({
                ...previous,
                name: nameError,
                description: descriptionError,
            }));
            return false;
        }

        return true
    }

    function validateLocationLocal(): boolean {
        if (!teamData.location) return true;

        const positionError = validateLocation(teamData.location)

        if (positionError) {
            setFieldErrors(previous => ({
                ...previous,
                location: positionError
            }));
            return false;
        }

        return true;
    }

    function validateLogo(): boolean {

        if (!teamData.logo) {
            return true
        }

        const logoError = validateMedia(teamData.logo, 5)

        if (logoError) {
            setFieldErrors(previous => ({
                ...previous,
                logo: logoError,
            }));
            return false;
        }

        return true;
    }

    function validateSport(): boolean {
        if (!teamData.sport) {
            setFieldErrors(previous => ({
                ...previous,
                sport: "Campo obbligatorio",
            }));
            return false
        }
        return true;
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

            const response = await createTeam(request);

            router.replace(`/teams/${response.id}`);
        } catch (error) {
            const apiError = normalizeApiRequestError(error);
            setApiError(apiError.message);
        }
    }

    return (
        <CreateTeamPage
            team={teamData}
            currentStep={currentStep}
            fieldErrors={fieldErrors}
            apiError={apiError}
            isSubmitting={isSubmitting}
            onChangeField={updateTeamData}
            onBack={handleBack}
            onNext={handleNext}
        />
    );
}