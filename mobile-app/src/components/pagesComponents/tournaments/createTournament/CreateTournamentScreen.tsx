import {useRef, useState} from "react";
import {TournamentCreationRequest, TournamentErrorFields} from "@/src/services/tournaments/tournamentDTO";
import CreateTournamentPage, {
    FIRST_STEP,
    LAST_STEP,
    STEPS,
    TournamentCreationStep,
} from "@/src/components/pagesComponents/tournaments/createTournament/CreateTournamentPage";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {checkTournamentNameAlreadyExists, createTournament} from "@/src/services/tournaments/tournamentService";
import {router} from "expo-router";
import {isAfter, isTodayOrFuture} from "@/src/services/common";
import {
    validateDescription,
    validateLocation,
    validateMedia,
    validateUniqueName
} from "@/src/components/common/forms/validator/validator";


export default function CreateTournamentScreen() {


    const submissionLock = useRef(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<TournamentErrorFields>({});

    const [currentStep, setCurrentStep] = useState<TournamentCreationStep>(FIRST_STEP);

    const [tournamentData, setTournamentData] = useState<TournamentCreationRequest>({
        name: "",
        description: "",
        location: null,
        sport: null,
        format: null,
        startDate: null,
        endDate: null,
        minTeams: 2,
        maxTeams: 2,
        recruitmentStatus: "CLOSED",
        logo: null,
        rules: null,
    })

    function updateTournamentData<K extends keyof TournamentCreationRequest>(
        field: K,
        value: TournamentCreationRequest[K],
    ) {
        setTournamentData(previous => ({
            ...previous,
            [field]: value,
        }));

        setFieldErrors(previous => ({
            ...previous,
            [field]: undefined,
        }));

        setApiError("");
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


    async function validateStep(
        step: TournamentCreationStep,
    ): Promise<boolean> {


        switch (step) {
            case 0:
                return validateNameAndDescription();
            case 1:
                return validateLocationLocal();
            case 2:
                return validateLogoAndRules();
            case 3:
                return validateSportAndFormat();
            case 4 :
                return validateDates();
            case 5:
                return validateTeamsNumbers();
        }
    }

    async function validateNameAndDescription(): Promise<boolean> {
        const trimmedName = tournamentData.name.trim();
        const trimmedDescription = tournamentData.description?.trim() ?? "";

        let nameError = undefined;

        try {
            nameError = await validateUniqueName(trimmedName, checkTournamentNameAlreadyExists)
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
        if (!tournamentData.location) return true;

        const positionError = validateLocation(tournamentData.location)

        if (positionError) {
            setFieldErrors(previous => ({
                ...previous,
                location: positionError
            }));
            return false;
        }

        return true;
    }

    function validateLogoAndRules() {

        let logoError: string | undefined;
        let rulesError: string | undefined;

        if (tournamentData.logo) {
            logoError = validateMedia(tournamentData.logo, 5)
        }

        if (tournamentData.rules) {
            rulesError = validateMedia(tournamentData.rules, 5)
        }

        if (logoError || rulesError) {
            setFieldErrors(previous => ({
                ...previous,
                logo: logoError,
                rules: rulesError
            }));
            return false;
        }
        return true;
    }

    function validateSportAndFormat() {
        if (!tournamentData.sport) {
            setFieldErrors(previous => ({
                ...previous,
                sport: "Campo obbligatorio",
            }));
            return false
        }
        if (!tournamentData.format) {
            setFieldErrors(previous => ({
                ...previous,
                format: "Campo obbligatorio",
            }));
            return false
        }

        return true;
    }

    function validateDates() {

        const startingDate = tournamentData.startDate
        const startingDateError =
            !startingDate ? "Data inizio non selezionata"
                : !isTodayOrFuture(startingDate) ? "La data di inizio non può essere nel passato"
                    : undefined


        const endingDate = tournamentData.endDate
        const endingDateError =
            !endingDate ? "Data fine non selezionata"
                : !isTodayOrFuture(endingDate) ? "La data di fine non può essere nel passato"
                    : startingDate && !isAfter(endingDate, startingDate) ? "La data di fine deve essere dopo la data di inizio"
                        : undefined


        setFieldErrors(previous => ({
            ...previous,
            startingDate: startingDateError,
            endingDate: endingDateError,
        }));

        return !startingDateError && !endingDateError;

    }

    function validateTeamsNumbers() {
        const minTeams = tournamentData.minTeams;
        const maxTeams = tournamentData.maxTeams;

        const minTeamsError =
            minTeams < 2
                ? "Il numero minimo di squadre è 2"
                : undefined;

        const maxTeamsError =
            maxTeams < 2
                ? "Il numero massimo di squadre deve essere almeno 2"
                : maxTeams < minTeams
                    ? "Il numero massimo di squadre non può essere inferiore al minimo"
                    : undefined;


        setFieldErrors(previous => ({
            ...previous,
            minTeams: minTeamsError,
            maxTeams: maxTeamsError,
        }));

        return !minTeamsError && !maxTeamsError;
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
                    await handleCreateTournament();
                }
            } else if (await validateStep(currentStep)) {
                setCurrentStep(
                    previous => (previous + 1) as TournamentCreationStep,
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
            previous => (previous - 1) as TournamentCreationStep,
        );
    }

    async function handleCreateTournament(): Promise<void> {
        try {
            const request: TournamentCreationRequest = {
                ...tournamentData,
                name: tournamentData.name.trim(),
                description: tournamentData.description?.trim() || undefined,
            };

            const response = await createTournament(request);

            router.replace(`/tournaments/${response.id}`);
        } catch (error) {
            const apiError = normalizeApiRequestError(error);
            setApiError(apiError.message);
        }
    }


    return (
        <CreateTournamentPage
            tournament={tournamentData}
            currentStep={currentStep}
            fieldErrors={fieldErrors}
            apiError={apiError}
            isSubmitting={isSubmitting}
            onChangeField={updateTournamentData}
            onBack={handleBack}
            onNext={handleNext}
        />

    );

}