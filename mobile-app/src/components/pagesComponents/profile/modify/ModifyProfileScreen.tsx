 import {useCallback, useEffect, useRef, useState} from "react";
import {router} from "expo-router";

import {loadCurrentUserId} from "@/src/services/users/authService";
import {fetchUser, modUser} from "@/src/services/users/userService";

import {
    DeletingStatus,
    ProfileFormErrors,
    Sport,
    SPORT_ROLES,
    type SportRole,
    UserInfo,
    UserModRequest,
} from "@/src/services/users/userDTO";
import {normalizeApiRequestError} from "@/src/services/errorService";

import LoadingScreen from "@/src/components/common/loading/LoadingScreen";
import ErrorScreen from "@/src/components/common/errors/ErrorScreen";

import ModifyProfilePage, {FIRST_STEP, LAST_STEP, type ProfileEditStep, STEPS,} from "./ModifyProfilePage";


export default function ModifyProfileScreen() {
    const requestIdRef = useRef(0);
    const submissionLock = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [profile, setProfile] = useState<UserInfo>({
        id: "",
        firstName: "",
        lastName: "",
        username: "",
        birthDate: null,
        gender: null,
        location: null,
        sports: [],
        roles: [],
        avatar: null,
        deletingStatus: DeletingStatus.ACTIVE
    });
    const [newProfile, setNewProfile] = useState<UserModRequest | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [currentStep, setCurrentStep] = useState<ProfileEditStep>(FIRST_STEP);
    const [fieldErrors, setFieldErrors] = useState<ProfileFormErrors>({});
    const [apiError, setApiError] = useState("");

    const loadProfile = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        setIsLoading(true);
        setLoadError("");

        try {
            const currentUserId = await loadCurrentUserId();

            if (requestId !== requestIdRef.current) {
                return;
            }

            if (currentUserId === null || currentUserId === undefined) {
                router.replace("/(auth)");
                return;
            }

            const id = String(currentUserId);
            const user = await fetchUser(id);

            if (requestId !== requestIdRef.current) {
                return;
            }

            setNewProfile({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                location: user.location ?? null,
                sports: user.sports,
                roles: user.roles,
                avatar: undefined,
            });

            setProfile({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                birthDate: user.birthDate,
                gender: user.gender,
                location: user.location ?? null,
                sports: user.sports,
                roles: user.roles,
                avatar: user.avatar,
                deletingStatus: user.deletingStatus
            });
        } catch (error) {
            if (requestId !== requestIdRef.current) {
                return;
            }

            const apiError = normalizeApiRequestError(error);

            if (apiError.status !== 401) {
                setLoadError(apiError.message);
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        void loadProfile();

        return () => {
            requestIdRef.current++;
        };
    }, [loadProfile]);

    // Aggiornamento campi

    function updateField<K extends keyof UserModRequest>(
        field: K,
        value: UserModRequest[K],
    ) {
        if (submissionLock.current) return;

        setNewProfile(previous =>
            previous ? {...previous, [field]: value} : previous
        );

        setFieldErrors(previous => ({
            ...previous,
            [field]: undefined,
        }));

        setApiError("");
    }

    function toggleSport(sport: Sport) {
        if (submissionLock.current) return;

        setNewProfile(previous => {
            if (!previous) return previous;

            const selected = previous.sports.includes(sport);

            return {
                ...previous,
                sports: selected
                    ? previous.sports.filter(item => item !== sport)
                    : [...previous.sports, sport],
                roles: selected
                    ? previous.roles.filter(item => item.sport !== sport)
                    : previous.roles,
            };
        });

        setFieldErrors(previous => ({
            ...previous,
            sports: undefined,
            roles: undefined,
        }));

        setApiError("");
    }

    function toggleRole(sport: Sport, role: SportRole) {
        if (submissionLock.current) return;

        setNewProfile(previous => {
            if (!previous || !previous.sports.includes(sport)) {
                return previous;
            }

            const selected = previous.roles.some(
                item => item.sport === sport && item.role === role
            );

            return {
                ...previous,
                roles: selected
                    ? previous.roles.filter(
                        item => !(item.sport === sport && item.role === role)
                    )
                    : [...previous.roles, {sport, role}],
            };
        });

        setFieldErrors(previous => ({
            ...previous,
            roles: undefined,
        }));

        setApiError("");
    }

    // Validazione

    function validateStep(step: ProfileEditStep): boolean {
        if (!newProfile) return false;

        const errors: ProfileFormErrors = {};

        switch (step) {
            case 0:
                errors.firstName = newProfile.firstName.trim()
                    ? undefined
                    : "Inserisci il nome";

                errors.lastName = newProfile.lastName.trim()
                    ? undefined
                    : "Inserisci il cognome";
                break;

            case 1:
                errors.username = newProfile.username.trim()
                    ? undefined
                    : "Inserisci lo username";

                errors.avatar =
                    newProfile.avatar?.fileSize !== undefined &&
                    newProfile.avatar.fileSize > 5 * 1024 * 1024
                        ? "Il logo non può superare i 5 MB"
                        : undefined;
                break;

            case 2: {
                const location = newProfile.location;

                const valid =
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

                errors.location = valid
                    ? undefined
                    : "La posizione selezionata non è valida";
                break;
            }

            case 3: {
                const validSports =
                    newProfile.sports.length > 0 &&
                    newProfile.sports.every(sport =>
                        Object.values(Sport).includes(sport)
                    );

                errors.sports = validSports
                    ? undefined
                    : "Seleziona almeno uno sport valido";

                const hasRolesForEverySport =
                    validSports &&
                    newProfile.sports.every(sport =>
                        newProfile.roles.some(
                            item =>
                                item.sport === sport &&
                                SPORT_ROLES[sport].some(
                                    role => role === item.role
                                )
                        )
                    );

                const allRolesValid = newProfile.roles.every(
                    item =>
                        newProfile.sports.includes(item.sport) &&
                        SPORT_ROLES[item.sport]?.some(
                            role => role === item.role
                        )
                );

                errors.roles = !validSports
                    ? undefined
                    : !hasRolesForEverySport
                        ? "Seleziona almeno un ruolo per ogni sport"
                        : !allRolesValid
                            ? "La selezione dei ruoli non è valida"
                            : undefined;
                break;
            }
        }

        setFieldErrors(previous => ({...previous, ...errors}));

        return !Object.values(errors).some(Boolean);
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

    // Navigazione e salvataggio

    async function handleNext(): Promise<void> {
        if (submissionLock.current || !newProfile) return;

        submissionLock.current = true;
        setIsSubmitting(true);
        setApiError("");

        try {
            if (currentStep === LAST_STEP) {
                if (validateForm()) {
                    await handleSave();
                }
            } else if (validateStep(currentStep)) {
                setCurrentStep(
                    previous => (previous + 1) as ProfileEditStep
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
        setCurrentStep(previous => (previous - 1) as ProfileEditStep);
    }

    async function handleSave(): Promise<void> {
        if (!newProfile) return;

        try {
            const request: UserModRequest = {
                ...newProfile,
                firstName: newProfile.firstName.trim(),
                lastName: newProfile.lastName.trim(),
                username: newProfile.username.trim(),
            };

            await modUser(request);

            router.back();
        } catch (error) {
            const apiError = normalizeApiRequestError(error);

            if (apiError.status !== 401) {
                setApiError(apiError.message);
            }
        }
    }

    if (isLoading) {
        return <LoadingScreen message="Caricamento profilo..."/>;
    }

    if (loadError) {
        return (
            <ErrorScreen
                title="Impossibile caricare il profilo"
                message={loadError}
                onRetry={loadProfile}
                isRetrying={isLoading}
            />
        );
    }

    if (!newProfile) {
        return null;
    }

    return (
        <ModifyProfilePage
            oldProfile={profile}
            profile={newProfile}
            currentStep={currentStep}
            fieldErrors={fieldErrors}
            apiError={apiError}
            isSubmitting={isSubmitting}
            onChangeField={updateField}
            onToggleSport={toggleSport}
            onToggleRole={toggleRole}
            onBack={handleBack}
            onNext={handleNext}
        />
    );
}