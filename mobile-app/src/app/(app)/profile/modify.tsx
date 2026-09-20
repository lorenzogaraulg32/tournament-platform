import {useEffect, useState} from "react";
import {router} from "expo-router";
import {loadUserInfo, modUser, UserInfo, UserModInfo, type UserOnBoardingInfo,} from "@/src/services/users/userService";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {Sport, type SportRole,} from "@/src/services/users/userConstants";
import {
    validateFirstName,
    validateImage,
    validateLastName,
    validateUserLocation,
    validateUsername,
    validateUserSportsAndRoles,
} from "@/src/constants/helpers/validationHelper";
import {type SelectedImage, uploadProfilePicture,} from "@/src/services/imagesService";
import SportsAndRolesStep from "@/src/components/pagesComponents/onBoarding/steps/SportsAndRolesStep";
import LocationStep from "@/src/components/pagesComponents/onBoarding/steps/LocationStep";
import {Alert, View} from "react-native";
import {loadCurrentUserId} from "@/src/services/users/authService";
import NameAndSurnameModStep from "@/src/components/pagesComponents/profile/modify/steps/NameAndSurnameModStep";
import UsernameAndLogoModStep from "@/src/components/pagesComponents/profile/modify/steps/UsernameAndLogoModStep";
import FormLayout from "@/src/components/common/forms/FormLayout";
import FormProgressBar from "@/src/components/common/forms/FormProgressBar";
import FormContent from "@/src/components/common/forms/FormContent";


const TOTAL_STEPS = 4;

type userModErrorField = {
    username?: string;
    profileLogo?: string;
    firstName?: string;
    lastName?: string;
    sports?: string;
    location?: string;
};

export default function ModifyUserPage() {

    const [currentUser, setCurrentUser] = useState<UserInfo>()
    const [fieldErrors, setFieldErrors] = useState<userModErrorField>({});
    const [apiError, setApiError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState<UserModInfo>({
        username: "",
        firstName: "",
        lastName: "",
        sports: [],
        roles: [],
        location: null,
        newPicUrl: undefined,
    });

    const [profileLogoRemoved, setProfileLogoRemoved] = useState(false);
    const [profileLogo, setProfileLogo] = useState<SelectedImage | null>(null);


    useEffect(() => {

        async function loadUserData() {
            try {
                const currentUserId = await loadCurrentUserId();
                const user = await loadUserInfo(currentUserId)

                const userModInfo: UserModInfo = {
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    sports: user.sports,
                    roles: user.roles,
                    location: user.location,
                    newPicUrl: user.profilePicUrl
                }

                setUserData(userModInfo)
                setCurrentUser(user);

            } catch (error) {

                const apiError = normalizeApiRequestError(error);

                // Redirect già gestito
                if (apiError.status === 401) {
                    return;
                }
            }
        }

        void loadUserData()

    }, []);


    async function handleMod() {
        try {
            setApiError("");
            setLoading(true);

            await modUser(userData);

            if (profileLogo) {
                try {
                    await uploadProfilePicture(profileLogo);
                } catch (error) {
                    const normalizedError = normalizeApiRequestError(error);

                    console.warn(
                        "Profilo modificato, ma caricamento immagine fallito:",
                        normalizedError.message,
                    );

                    Alert.alert(
                        "Profilo creato",
                        "Il profilo è stato modificato correttamente, ma non è stato possibile modificare l'immagine. Potrai riprovare in seguito.",
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

    const handleFieldChange = <K extends keyof UserOnBoardingInfo>(field: K, value: UserOnBoardingInfo[K]) => {
        setUserData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    function applyFieldErrors(errors: userModErrorField): boolean {
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

        const isLastStep = step === TOTAL_STEPS;

        if (!isLastStep) {
            setStep(currentStep => currentStep + 1);
            return;
        }

        await handleMod()

    };

    const handleBack = () => {
        if (isLoading) {
            return;
        }

        setStep(currentStep => Math.max(currentStep - 1, 0));
    };

    function removeLogo() {
        setProfileLogo(null);
        setProfileLogoRemoved(true);

        setUserData(previous => ({
            ...previous,
            newPicUrl: "REMOVE",
        }));

        setFieldErrors(previous => ({
            ...previous,
            profileLogo: undefined,
        }));

        setApiError("");
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
            profileLogo: validateImage(profileLogo),
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
            case 1:
                return validateNameAndSurname();
            case 2:
                return validateUsernameAndLogo();
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
            case 1:
                return (
                    <NameAndSurnameModStep
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

            case 2:
                return (
                    <UsernameAndLogoModStep
                        username={userData.username}
                        profileLogo={profileLogo}
                        usernameError={fieldErrors.username}
                        profileLogoError={fieldErrors.profileLogo}
                        onUsernameChange={value => handleFieldChange("username", value)}
                        onProfileLogoChange={setProfileLogo}
                        existingLogoSource={
                            profileLogoRemoved ? undefined : (currentUser?.profilePicUrl || undefined)
                        }
                        onBack={handleBack}
                        onNext={handleNext}
                        local onRemove={removeLogo}/>
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

    const formStep =
        step === 0
            ? "first"
            : step === TOTAL_STEPS
                ? "last"
                : "middle";

    return (
        <FormLayout
            header={null}
            variant={"teams"}>
            <FormProgressBar
                step={step + 1}
                totalSteps={TOTAL_STEPS}
            />

            <FormContent
                handleBack={handleBack}
                handleNext={handleNext}
                isSubmitting={isLoading}
                step={formStep}
                apiError={apiError}>
                <View pointerEvents={isLoading ? "none" : "auto"}>
                    {renderStep()}
                </View>
            </FormContent>
        </FormLayout>
    );
}
