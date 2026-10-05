import {useRef, useState} from "react";
import {router, useLocalSearchParams} from "expo-router";
import {checkUsernameAlreadyExists, modUser} from "@/src/services/users/userService";

import {ProfileFormErrors, Sport, type SportRole, UserInfo, UserModRequest,} from "@/src/services/users/userDTO";
import {normalizeApiRequestError} from "@/src/services/errorService";

import ModifyProfilePage, {FIRST_STEP, LAST_STEP, type ProfileEditStep, STEPS,} from "./ModifyProfilePage";
import {
    validateLocation,
    validateMedia,
    validateStandardName,
    validateUniqueName,
    validateUserSportsAndRoles
} from "@/src/components/common/forms/validator/validator";


export default function ModifyProfileScreen() {

    const params = useLocalSearchParams<{ profile: string }>()
    const oldProfile = JSON.parse(params.profile) as UserInfo

    const submissionLock = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newProfile, setNewProfile] = useState<UserModRequest>({
        username: oldProfile.username,
        firstName: oldProfile.firstName,
        lastName: oldProfile.lastName,
        sports: oldProfile.sports,
        roles: oldProfile.roles,
        location: oldProfile.location,
        avatar: oldProfile.avatar
    });

    const [currentStep, setCurrentStep] = useState<ProfileEditStep>(FIRST_STEP);
    const [fieldErrors, setFieldErrors] = useState<ProfileFormErrors>({});
    const [apiError, setApiError] = useState("");


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

    async function validateStep(step: ProfileEditStep): Promise<boolean> {
        if (!newProfile) return false;
        switch (step) {
            case 0:
                return validateNameAndSurname()
            case 1:
                return await validateUsernameAndAvatar()
            case 2:
                return validateLocationLocal()
            case 3:
                return validateUserSportsAndRolesLocal()
        }

    }

    function validateNameAndSurname(): boolean {
        const trimmedName = newProfile.firstName.trim()
        const trimmedLastName = newProfile.lastName.trim()
        const nameError = validateStandardName(trimmedName);
        const lastNameError = validateStandardName(trimmedLastName);

        if (nameError || lastNameError) {
            setFieldErrors(previous => ({
                ...previous,
                firstName: nameError,
                lastName: lastNameError,
            }));
            return false;
        }

        return true;
    }

    async function validateUsernameAndAvatar() {

        const trimmedUsername = newProfile.username.trim()
        let usernameError = undefined;


        try {
            if (trimmedUsername !== oldProfile.username.trim()) {
                usernameError = await validateUniqueName(trimmedUsername, checkUsernameAlreadyExists)
            }
        } catch (error) {
            const apiError = normalizeApiRequestError(error)
            setApiError(apiError.message);
            return false;

        }

        let avatarError = undefined;

        if (newProfile.avatar) {
            avatarError = validateMedia(newProfile.avatar, 5)
        }

        if (usernameError || avatarError) {
            setFieldErrors(previous => ({
                ...previous,
                username: usernameError,
                avatar: avatarError
            }));
            return false;
        }

        return true;


    }

    function validateLocationLocal(): boolean {
        if (!newProfile.location) return true;

        const positionError = validateLocation(newProfile.location)

        if (positionError) {
            setFieldErrors(previous => ({
                ...previous,
                location: positionError
            }));
            return false;
        }

        return true;
    }

    function validateUserSportsAndRolesLocal() {
        const userSportAndRolesError = validateUserSportsAndRoles(newProfile)
        if (userSportAndRolesError) {
            setFieldErrors(
                previous => ({
                    ...previous,
                    roles: userSportAndRolesError
                })
            )
            return false;
        }
        return true;
    }

    async function validateForm(): Promise<boolean> {
        for (const step of STEPS) {
            if (!await validateStep(step)) {
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
                if (await validateForm()) {
                    await handleSave();
                }
            } else if (await validateStep(currentStep)) {
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
            setApiError(apiError.message);
        }
    }


    return (
        <ModifyProfilePage
            oldProfile={oldProfile}
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