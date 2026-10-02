import {useRef, useState} from "react";
import {TournamentCreationRequest, TournamentErrorFields} from "@/src/services/tournaments/tournamentDTO";
import CreateTournamentPage, {
    FIRST_STEP,
    LAST_STEP,
    STEPS,
    TournamentCreationStep,
} from "@/src/components/pagesComponents/tournaments/createTournament/CreateTournamentPage";
import {normalizeApiRequestError, printApiRequestError} from "@/src/services/errorService";
import {checkTournamentNameAlreadyExists, createTournament} from "@/src/services/tournaments/tournamentService";
import {router} from "expo-router";
import {isAfter, isTodayOrFuture} from "@/src/services/common";
import {isPdf} from "@/src/services/mediaService";


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
        startingDate: null,
        endingDate: null,
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
                return validateLocation();
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

        const nameError =
            trimmedName.length < 5 || trimmedName.length > 20
                ? "Il nome deve avere tra 5 e 20 caratteri"
                : undefined;

        const descriptionError =
            trimmedDescription.length > 160
                ? "La descrizione non può superare i 160 caratteri"
                : undefined;


        const recruitmentStatusError = tournamentData.recruitmentStatus ? undefined : "Stato di reclutamento non selezionato"

        setFieldErrors(previous => ({
            ...previous,
            name: nameError,
            description: descriptionError,
            recruitmentStatus: recruitmentStatusError,
        }));

        if (
            nameError ||
            descriptionError ||
            recruitmentStatusError
        ) {
            return false;
        }
        try {
            await checkTournamentNameAlreadyExists(trimmedName);
            return true;
        } catch (error) {
            const apiError = normalizeApiRequestError(error);


            if (apiError.status === 401) {
                return false;
            }

            if (apiError.status === 409 && apiError.message === "Esiste già un torneo con questo nome") {
                setFieldErrors(previous => ({
                    ...previous,
                    name: apiError.message,
                }));
            } else {
                setApiError(apiError.message);
            }

            return false;
        }
    }


    function validateLocation(): boolean {
        const location = tournamentData.location;

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

    function validateLogoAndRules() {

        const logoError =
            tournamentData.logo?.fileSize !== undefined &&
            tournamentData.logo.fileSize > 5 * 1024 * 1024
                ? "Il logo non può superare i 5 MB"
                : undefined;

        let rulesError: string | undefined

        if (tournamentData.rules) {
            if (!isPdf(tournamentData.rules)) {
                rulesError = "Sono supportati solo file di tipo .pdf";
            } else if (
                tournamentData.rules.fileSize !== undefined &&
                tournamentData.rules.fileSize > 5 * 1024 * 1024
            ) {
                rulesError = "Il file regole non può superare i 5 MB";
            }
        }

        setFieldErrors(previous => ({
            ...previous,
            logo: logoError,
            rules: rulesError,
        }));

        return !logoError && !rulesError;
    }

    function validateSportAndFormat() {
        const sportError = !tournamentData.sport
            ? "Seleziona uno sport"
            : undefined;

        const formatError = !tournamentData.format
            ? "Seleziona un formato"
            : undefined;

        setFieldErrors(previous => ({
            ...previous,
            sport: sportError,
            format: formatError,
        }));

        return !sportError && !formatError;
    }

    function validateDates() {

        const startingDate = tournamentData.startingDate
        const startingDateError =
            !startingDate ? "Data inizio non selezionata"
                : !isTodayOrFuture(startingDate) ? "La data di inizio non può essere nel passato"
                    : undefined


        const endingDate = tournamentData.endingDate
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

            // Redirect già gestito da authenticatedFetch.
            if (apiError.status === 401) {
                return;
            }

            printApiRequestError(apiError);
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