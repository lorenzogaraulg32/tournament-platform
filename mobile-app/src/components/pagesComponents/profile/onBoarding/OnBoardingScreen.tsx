import {useRef, useState} from "react";
import {ProfileFormErrors, UserCreationRequest} from "@/src/services/users/userDTO";

import {
    validateLocation,
    validateMedia,
    validateStandardName,
    validateUniqueName,
    validateUserSportsAndRoles
} from "@/src/components/common/forms/validator/validator";
import OnBoardingPage, {
    FIRST_STEP,
    LAST_STEP,
    ProfileCreationStep,
    STEPS
} from "@/src/components/pagesComponents/profile/onBoarding/OnBoardingPage";
import {checkUsernameAlreadyExists, createUser} from "@/src/services/users/userService";
import {router} from "expo-router";
import {normalizeApiRequestError} from "@/src/services/errorService";


export default function OnBoardingScreen() {
    const [fieldErrors, setFieldErrors] = useState<ProfileFormErrors>({});
    const [apiError, setApiError] = useState("");

    const submissionLock = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentStep, setCurrentStep] = useState<ProfileCreationStep>(FIRST_STEP);


    const [userData, setUserData] = useState<UserCreationRequest>({
        username: "",
        firstName: "",
        lastName: "",
        birthDate: null,
        gender: null,
        sports: [],
        roles: [],
        location: null,
        avatar: null,
    });


    const handleFieldChange = <K extends keyof UserCreationRequest>(
        field: K,
        value: UserCreationRequest[K]
    ) => {
        setUserData(prev => ({
            ...prev,
            [field]: value,
        }));
        setFieldErrors(prev => ({
            ...prev,
            [field]: undefined,
        }));

        setApiError("");
    };

    async function handleOnboarding() {
        try {
            const request: UserCreationRequest = {
                ...userData,
                firstName: userData.firstName.trim(),
                lastName: userData.lastName.trim(),
                username: userData.username.trim()
            }

            await createUser(request)

            router.replace("/(app)/home");
        } catch (error) {
            const apiError = normalizeApiRequestError(error);
            setApiError(apiError.message);
        }
    }

    const handleNext = async () => {
        if (submissionLock.current) {
            return;
        }

        submissionLock.current = true;
        setIsSubmitting(true);
        setApiError("");

        try {
            if (currentStep === LAST_STEP) {
                if (await validateForm()) {
                    await handleOnboarding();
                }
            } else if (await validateStep(currentStep)) {
                setCurrentStep(
                    previous => (previous + 1) as ProfileCreationStep
                );
            }
        } finally {
            submissionLock.current = false;
            setIsSubmitting(false);
        }
    };

    function handleBack() {
        if (submissionLock.current || currentStep === FIRST_STEP) {
            return;
        }

        setApiError("");
        setCurrentStep(
            previous => (previous - 1) as ProfileCreationStep,
        );
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

    async function validateStep(step: ProfileCreationStep): Promise<boolean> {
        switch (step) {
            case 0:
                return validateNameAndSurname();

            case 1:
                return await validateUsernameAndAvatar();

            case 2:
                return validateBirthDateAndGender();

            case 3:
                return validateUserSportsAndRolesLocal();

            case 4:
                return validateLocationLocal();
        }
    }

    function validateNameAndSurname(): boolean {
        const trimmedName = userData.firstName.trim()
        const trimmedLastName = userData.lastName.trim()
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

        const trimmedUsername = userData.username.trim()
        let usernameError = undefined;

        try {
            usernameError = await validateUniqueName(trimmedUsername, checkUsernameAlreadyExists)
        } catch (error) {
            const apiError = normalizeApiRequestError(error)
            setApiError(apiError.message);
            return false;
        }

        let avatarError = undefined;

        if (userData.avatar) {
            avatarError = validateMedia(userData.avatar, 5)
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

    function validateBirthDateAndGender(): boolean {
        let genderError = undefined;

        if (!userData.gender) {
            genderError = "Seleziona un genere"
        }

        let birthDateError = undefined

        if (!userData.birthDate) {
            birthDateError = "La data di nascita è obbligatoria";
        } else {
            const birthDate = new Date(userData.birthDate);

            if (
                Number.isNaN(birthDate.getTime()) ||
                birthDate >= new Date()
            ) {
                birthDateError = "La data di nascita non è valida";
            }
        }

        if (genderError || birthDateError) {
            setFieldErrors(previous => ({
                ...previous,
                gender: genderError,
                birthDate: birthDateError
            }));
            return false;
        }

        return true

    }

    function validateUserSportsAndRolesLocal() {

        const userSportAndRolesError = validateUserSportsAndRoles(userData)
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

    function validateLocationLocal(): boolean {
        if (!userData.location) return true;

        const positionError = validateLocation(userData.location)

        if (positionError) {
            setFieldErrors(previous => ({
                ...previous,
                location: positionError
            }));
            return false;
        }

        return true;
    }

    return (
        <OnBoardingPage
            user={userData}
            currentStep={currentStep}
            fieldErrors={fieldErrors}
            apiError={apiError} isSubmitting={isSubmitting}
            onChangeField={handleFieldChange}
            onBack={handleBack} onNext={handleNext}
        />
    )


}