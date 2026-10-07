import {useRef, useState} from "react";
import {router, useLocalSearchParams} from "expo-router";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {TeamDetails, TeamFormErrors, TeamUpdateRequest} from "@/src/services/teams/teamDTO";
import {checkTeamNameAlreadyExists, editTeam} from "@/src/services/teams/teamService";
import ModifyTeamPage, {
    FIRST_STEP,
    LAST_STEP,
    STEPS,
    TeamEditStep
} from "@/src/components/pagesComponents/teams/modify/ModifyTeamPage";
import {
    validateDescription,
    validateLocation,
    validateMedia,
    validateUniqueName
} from "@/src/components/common/forms/validator/validator";

// In questo componente
// si recuperano i valori della squadra
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
                return validateLocationLocal();
            case 2:
                return validateLogo();
            case 3:
                return validateSport();
        }
    }

    async function validateNameAndDescription(): Promise<boolean> {

        const trimmedName = modTeamData.name?.trim() ?? "";
        const trimmedDescription = modTeamData.description?.trim() ?? "";

        let nameError = undefined;


        try {
            if (trimmedName !== oldTeam.name.trim())
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
        if (!modTeamData.location) return true;

        const positionError = validateLocation(modTeamData.location)

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

        if (!modTeamData.logo) {
            return true
        }

        const logoError = validateMedia(modTeamData.logo, 5)

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
        if (!modTeamData.sport) {
            setFieldErrors(previous => ({
                ...previous,
                sport: "Campo obbligatorio",
            }));
            return false
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