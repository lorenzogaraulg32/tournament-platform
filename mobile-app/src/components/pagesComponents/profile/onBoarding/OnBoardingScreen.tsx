import {useRef, useState} from "react";
import {ProfileFormErrors, UserCreationRequest} from "@/src/services/users/userDTO";

import {
    validateBirthDate,
    validateFirstName,
    validateImage,
    validateLastName,
    validateUserLocation,
    validateUsername,
    validateUserSportsAndRoles
} from "@/src/constants/helpers/validationHelper";
import OnBoardingPage, {
    FIRST_STEP,
    LAST_STEP,
    ProfileCreationStep,
    STEPS
} from "@/src/components/pagesComponents/profile/onBoarding/OnBoardingPage";
import {createUser} from "@/src/services/users/userService";
import {router} from "expo-router";
import {normalizeApiRequestError, printApiRequestError} from "@/src/services/errorService";


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
    };

    function applyFieldErrors(
        errors: ProfileFormErrors
    ): boolean {
        setFieldErrors(errors);
        return !Object.values(errors).some(Boolean);
    }


    async function handleOnboarding() {
        try {
            const request: UserCreationRequest = {
                ...userData,
                firstName: userData.firstName.trim(),
                lastName: userData.lastName.trim(),
                username: userData.username.trim()
            }

            const response = await createUser(request)

            router.replace("/(app)/home");
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
            } else if (validateStep(currentStep)) {
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
            if (!validateStep(step)) {
                setCurrentStep(step);
                return false;
            }
        }

        return true;
    }

    function validateStep(step: ProfileCreationStep): boolean {
        switch (step) {
            case 0:
                return validateNameAndSurname();

            case 1:
                return validateUsernameAndLogo();

            case 2:
                return validateBirthDateAndGender();

            case 3:
                return validateSportsAndRoles();

            case 4:
                return validateLocation();

            default:
                return false;
        }
    }
    function validateNameAndSurname(): boolean {
        return applyFieldErrors({
            firstName: validateFirstName(userData),
            lastName: validateLastName(userData),
        });
    }

    function validateUsernameAndLogo(): boolean {
        return applyFieldErrors({
            username: validateUsername(userData),
            avatar: validateImage(userData),
        });
    }

    function validateBirthDateAndGender(): boolean {
        return applyFieldErrors({
            birthDate: validateBirthDate(userData),
            gender:
                userData.gender === null
                    ? "Seleziona un genere"
                    : "",
        });
    }

    function validateSportsAndRoles(): boolean {
        return applyFieldErrors({
            sports: validateUserSportsAndRoles(userData),
        });
    }

    function validateLocation(): boolean {
        return applyFieldErrors({
            location: validateUserLocation(userData),
        });
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