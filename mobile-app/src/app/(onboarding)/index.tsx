import {useState} from "react";
import {router} from "expo-router";
import {completeOnBoarding, type UserOnBoardingInfo,} from "@/src/services/users/userService";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {Sport, type SportRole,} from "@/src/services/users/userConstants";
import {
    validateBirthDate,
    validateFirstName,
    validateImage,
    validateLastName,
    validateUserLocation,
    validateUsername,
    validateUserSportsAndRoles,
} from "@/src/constants/helpers/validationHelper";
import {type SelectedImage, uploadProfilePicture,} from "@/src/services/imagesService";
import NameAndSurnameStep from "@/src/components/pagesComponents/onBoarding/steps/NameAndSurnameStep";
import UsernameAndLogoStep from "@/src/components/pagesComponents/onBoarding/steps/UsernameAndLogoStep";
import BirthDateAndGenderStep from "@/src/components/pagesComponents/onBoarding/steps/BirthDateAndGenderStep";
import SportsAndRolesStep from "@/src/components/pagesComponents/onBoarding/steps/SportsAndRolesStep";
import LocationStep from "@/src/components/pagesComponents/onBoarding/steps/LocationStep";
import {Alert} from "react-native";

const TOTAL_STEPS = 5;

type OnBoardingFieldErrors = {
    username?: string;
    profileLogo?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    gender?: string;
    sports?: string;
    location?: string;
};

export default function OnBoarding() {
    const [fieldErrors, setFieldErrors] = useState<OnBoardingFieldErrors>({});
    const [apiError, setApiError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState<UserOnBoardingInfo>({
        username: "",
        firstName: "",
        lastName: "",
        birthDate: null,
        gender: null,
        sports: [],
        roles: [],
        location: null,
    });
    const [profileLogo, setProfileLogo] = useState<SelectedImage | null>(null);


    async function handleOnboarding() {
        try {
            setApiError("");
            setLoading(true);

            await completeOnBoarding(userData);

            if (profileLogo) {
                try {
                    await uploadProfilePicture(profileLogo);
                } catch (error) {
                    const normalizedError = normalizeApiRequestError(error);

                    console.warn(
                        "Profilo creato, ma caricamento immagine fallito:",
                        normalizedError.message,
                    );

                    Alert.alert(
                        "Profilo creato",
                        "Il profilo è stato creato correttamente, ma non è stato possibile caricare l'immagine. Potrai riprovare in seguito.",
                        [
                            {
                                text: "Continua",
                                onPress: () =>
                                    router.replace("/(app)/home"),
                            },
                        ],
                        {
                            cancelable: false,
                        },
                    );

                    return;
                }
            }

            router.replace("/(app)/home");
        } catch (error) {
            const apiError = normalizeApiRequestError(error)

            setApiError(apiError.message);

            setFieldErrors((current) => ({
                ...current,
                username: apiError.errors.username?.[0] ?? current.username,
                firstName: apiError.errors.firstName?.[0] ?? current.firstName,
                lastName: apiError.errors.lastName?.[0] ?? current.lastName,
                birthDate: apiError.errors.birthDate?.[0] ?? current.birthDate,
                gender: apiError.errors.gender?.[0] ?? current.gender,
                sports:
                    apiError.errors.sports?.[0]
                    ?? apiError.errors.roles?.[0]
                    ?? current.sports,
                location: apiError.errors.location?.[0] ?? current.location,
                profileLogo: apiError.errors.profileLogo?.[0] ?? current.profileLogo,
            }));
        } finally {
            setLoading(false);
        }
    }


    /*----------------- Gestione degli steps e dei fields  -------------------*/

    const handleFieldChange = <K extends keyof UserOnBoardingInfo>(
        field: K,
        value: UserOnBoardingInfo[K]
    ) => {
        setUserData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    function applyFieldErrors(
        errors: OnBoardingFieldErrors
    ): boolean {
        setFieldErrors(errors);
        return !Object.values(errors).some(Boolean);
    }


    const toggleSport = (sport: Sport) => {
        setUserData(prev => {
            if (prev.sports.includes(sport)) {
                return {
                    ...prev,
                    sports: prev.sports.filter(
                        selectedSport => selectedSport !== sport
                    ),
                    roles: prev.roles.filter(
                        selectedRole => selectedRole.sport !== sport
                    ),
                };
            }

            return {
                ...prev,
                sports: [...prev.sports, sport],
            };
        });
    };

    const toggleRole = (sport: Sport, role: SportRole) => {
        setUserData(prev => {
            const isSelected = prev.roles.some(
                selectedRole =>
                    selectedRole.sport === sport &&
                    selectedRole.role === role
            );

            if (isSelected) {
                return {
                    ...prev,
                    roles: prev.roles.filter(
                        selectedRole =>
                            !(
                                selectedRole.sport === sport &&
                                selectedRole.role === role
                            )
                    ),
                };
            }

            return {
                ...prev,
                roles: [
                    ...prev.roles,
                    {
                        sport,
                        role,
                    },
                ],
            };
        });
    };

    const handleNext = async () => {
        if (isLoading) {
            return;
        }

        if (!validateCurrentStep()) {
            return;
        }

        const isLastStep = step === TOTAL_STEPS - 1;

        if (!isLastStep) {
            setStep(currentStep => currentStep + 1);
            return;
        }

        await handleOnboarding()

    };

    const handleBack = () => {
        if (isLoading) {
            return;
        }

        setStep(currentStep => Math.max(currentStep - 1, 0));
    };


    function validateNameAndSurname(): boolean {
        return applyFieldErrors({
            firstName: validateFirstName(userData),
            lastName: validateLastName(userData),
        });
    }

    function validateUsernameAndLogo(): boolean {
        return applyFieldErrors({
            username: validateUsername(userData),
            profileLogo: validateImage(profileLogo),
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

    function validateCurrentStep(): boolean {
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

    function renderStep() {
        switch (step) {
            case 0:
                return (
                    <NameAndSurnameStep
                        firstName={userData.firstName}
                        lastName={userData.lastName}
                        firstNameError={fieldErrors.firstName}
                        lastNameError={fieldErrors.lastName}
                        onFirstNameChange={value =>
                            handleFieldChange("firstName", value)
                        }
                        onLastNameChange={value =>
                            handleFieldChange("lastName", value)
                        }
                        onNext={handleNext}
                    />
                );

            case 1:
                return (
                    <UsernameAndLogoStep
                        username={userData.username}
                        profileLogo={profileLogo}
                        usernameError={fieldErrors.username}
                        profileLogoError={fieldErrors.profileLogo}
                        onUsernameChange={value =>
                            handleFieldChange("username", value)
                        }
                        onProfileLogoChange={setProfileLogo}
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                );

            case 2:
                return (
                    <BirthDateAndGenderStep
                        birthDate={userData.birthDate}
                        gender={userData.gender}
                        birthDateError={fieldErrors.birthDate}
                        genderError={fieldErrors.gender}
                        onBirthDateChange={value =>
                            handleFieldChange("birthDate", value)
                        }
                        onGenderChange={value =>
                            handleFieldChange("gender", value)
                        }
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                );

            case 3:
                return (
                    <SportsAndRolesStep
                        sports={userData.sports}
                        roles={userData.roles}
                        errorMessage={fieldErrors.sports}
                        onToggleSport={toggleSport}
                        onToggleRole={toggleRole}
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                );

            case 4:
                return (
                    <LocationStep
                        location={userData.location}
                        errorMessage={fieldErrors.location}
                        finalError={apiError}
                        isLoading={isLoading}
                        onLocationChange={value =>
                            handleFieldChange("location", value)
                        }
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                );

            default:
                return null;
        }
    }

    return renderStep();
}
