import {useCallback, useEffect, useRef, useState} from "react";
import {router} from "expo-router";

import {loadCurrentUserId} from "@/src/services/users/authService";
import {loadUserInfo, modUser, type UserModInfo,} from "@/src/services/users/userService";
import type {SelectedImage} from "@/src/services/imagesService";
import {Sport, SPORT_ROLES, type SportRole,} from "@/src/services/users/userConstants";
import {normalizeApiRequestError} from "@/src/services/errorService";

import LoadingScreen from "@/src/components/common/loading/LoadingScreen";
import ErrorScreen from "@/src/components/common/errors/ErrorScreen";

import ModifyProfilePage, {FIRST_STEP, LAST_STEP, type ProfileEditStep, STEPS,} from "./ModifyProfilePage";

export type ProfileFormData = Omit<UserModInfo, "newPicUrl">;

export type ProfileFieldErrors = Partial<
    Record<keyof ProfileFormData | "logo", string>
>;

export default function ModifyProfileScreen() {
    const requestIdRef = useRef(0);
    const submissionLock = useRef(false);

    const [profile, setProfile] = useState<ProfileFormData | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [currentStep, setCurrentStep] = useState<ProfileEditStep>(FIRST_STEP);
    const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
    const [apiError, setApiError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [existingLogoSource, setExistingLogoSource] = useState<string | undefined>();
    const [logo, setLogo] = useState<SelectedImage | null>(null);
    const [logoRemoved, setLogoRemoved] = useState(false);

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
            const user = await loadUserInfo(id);

            if (requestId !== requestIdRef.current) {
                return;
            }

            setProfile({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                location: user.location ?? null,
                sports: user.sports,
                roles: user.roles,
            });
            setExistingLogoSource(user.profilePicUrl || undefined);
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

    function updateField<K extends keyof ProfileFormData>(
        field: K,
        value: ProfileFormData[K],
    ) {
        if (submissionLock.current) return;

        setProfile(previous =>
            previous ? {...previous, [field]: value} : previous
        );

        setFieldErrors(previous => ({
            ...previous,
            [field]: undefined,
        }));

        setApiError("");
    }

    function updateLogo(newLogo: SelectedImage | null) {
        if (submissionLock.current) return;

        setLogo(newLogo);
        setLogoRemoved(false);
        setFieldErrors(previous => ({...previous, logo: undefined}));
        setApiError("");
    }

    function removeLogo() {
        if (submissionLock.current) return;

        setLogo(null);
        setLogoRemoved(true);
        setFieldErrors(previous => ({...previous, logo: undefined}));
        setApiError("");
    }

    function toggleSport(sport: Sport) {
        if (submissionLock.current) return;

        setProfile(previous => {
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

        setProfile(previous => {
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
        if (!profile) return false;

        const errors: ProfileFieldErrors = {};

        switch (step) {
            case 0:
                errors.firstName = profile.firstName.trim()
                    ? undefined
                    : "Inserisci il nome";

                errors.lastName = profile.lastName.trim()
                    ? undefined
                    : "Inserisci il cognome";
                break;

            case 1:
                errors.username = profile.username.trim()
                    ? undefined
                    : "Inserisci lo username";

                errors.logo =
                    logo?.fileSize !== undefined &&
                    logo.fileSize > 2 * 1024 * 1024
                        ? "Il logo non può superare i 2 MB"
                        : undefined;
                break;

            case 2: {
                const location = profile.location;

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
                    profile.sports.length > 0 &&
                    profile.sports.every(sport =>
                        Object.values(Sport).includes(sport)
                    );

                errors.sports = validSports
                    ? undefined
                    : "Seleziona almeno uno sport valido";

                const hasRolesForEverySport =
                    validSports &&
                    profile.sports.every(sport =>
                        profile.roles.some(
                            item =>
                                item.sport === sport &&
                                SPORT_ROLES[sport].some(
                                    role => role === item.role
                                )
                        )
                    );

                const allRolesValid = profile.roles.every(
                    item =>
                        profile.sports.includes(item.sport) &&
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
        if (submissionLock.current || !profile) return;

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
        if (!profile) return;

        try {
            const request: UserModInfo = {
                ...profile,
                firstName: profile.firstName.trim(),
                lastName: profile.lastName.trim(),
                username: profile.username.trim(),
                newPicUrl: logoRemoved ? "REMOVE" : undefined,
            };

            await modUser(request, logo);

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

    if (!profile) {
        return null;
    }

    return (
        <ModifyProfilePage
            profile={profile}
            logo={logo}
            existingLogoSource={
                logoRemoved ? undefined : existingLogoSource
            }
            currentStep={currentStep}
            fieldErrors={fieldErrors}
            apiError={apiError}
            isSubmitting={isSubmitting}
            onChangeField={updateField}
            onChangeLogo={updateLogo}
            onRemoveLogo={removeLogo}
            onToggleSport={toggleSport}
            onToggleRole={toggleRole}
            onBack={handleBack}
            onNext={handleNext}
        />
    );
}