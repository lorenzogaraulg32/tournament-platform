import NameAndSurnameStep from "@/src/components/pagesComponents/profile/onBoarding/steps/NameAndSurnameStep";
import UsernameAndAvatarStep from "@/src/components/pagesComponents/profile/onBoarding/steps/UsernameAndAvatarStep";
import BirthDateAndGenderStep from "@/src/components/pagesComponents/profile/onBoarding/steps/BirthDateAndGenderStep";
import SportsAndRolesStep from "@/src/components/pagesComponents/profile/onBoarding/steps/SportsAndRolesStep";
import LocationStep from "@/src/components/pagesComponents/profile/onBoarding/steps/LocationStep";
import {ProfileFormErrors, Sport, type SportRole, UserCreationRequest} from "@/src/services/users/userDTO";

export type ProfileCreationStep = 0 | 1 | 2 | 3 | 4;

export const FIRST_STEP: ProfileCreationStep = 0;
export const LAST_STEP: ProfileCreationStep = 4;
export const STEPS: ProfileCreationStep[] = [0, 1, 2, 3, 4];

type OnBoardingPageProps = {
    user: UserCreationRequest;
    currentStep: ProfileCreationStep;
    fieldErrors: ProfileFormErrors;
    apiError: string;
    isSubmitting: boolean;
    onChangeField: <K extends keyof UserCreationRequest>(
        field: K,
        value: UserCreationRequest[K],
    ) => void;
    onBack: () => void;
    onNext: () => Promise<void>;
};


export default function OnBoardinPage({
                                          user,
                                          currentStep,
                                          fieldErrors,
                                          apiError,
                                          isSubmitting,
                                          onChangeField,
                                          onBack,
                                          onNext
                                      }: OnBoardingPageProps) {


    const toggleSport = (sport: Sport) => {
        const isSelected = user.sports.includes(sport);

        if (isSelected) {
            onChangeField(
                "sports",
                user.sports.filter(
                    selectedSport => selectedSport !== sport
                )
            );

            onChangeField(
                "roles",
                user.roles.filter(
                    selectedRole => selectedRole.sport !== sport
                )
            );

            return;
        }

        onChangeField(
            "sports",
            [...user.sports, sport]
        );
    };
    const toggleRole = (sport: Sport, role: SportRole) => {
        const isSelected = user.roles.some(
            selectedRole =>
                selectedRole.sport === sport &&
                selectedRole.role === role
        );

        if (isSelected) {
            onChangeField(
                "roles",
                user.roles.filter(
                    selectedRole =>
                        !(
                            selectedRole.sport === sport &&
                            selectedRole.role === role
                        )
                )
            );

            return;
        }

        onChangeField(
            "roles",
            [...user.roles, {sport, role,},]
        );
    };


    function renderStep() {
        switch (currentStep) {
            case 0:
                return (
                    <NameAndSurnameStep
                        firstName={user.firstName}
                        lastName={user.lastName}
                        firstNameError={fieldErrors.firstName}
                        lastNameError={fieldErrors.lastName}
                        onFirstNameChange={value =>
                            onChangeField("firstName", value)
                        }
                        onLastNameChange={value =>
                            onChangeField("lastName", value)
                        }
                        onNext={onNext}
                    />
                );

            case 1:
                return (
                    <UsernameAndAvatarStep
                        username={user.username}
                        avatar={user.avatar}
                        usernameError={fieldErrors.username}
                        profileLogoError={fieldErrors.profileLogo}
                        onUsernameChange={value =>
                            onChangeField("username", value)
                        }
                        onAvatarChange={value =>
                            onChangeField("avatar", value)
                        }
                        onBack={onBack}
                        onNext={onNext}
                    />
                );

            case 2:
                return (
                    <BirthDateAndGenderStep
                        birthDate={user.birthDate}
                        gender={user.gender}
                        birthDateError={fieldErrors.birthDate}
                        genderError={fieldErrors.gender}
                        onBirthDateChange={value =>
                            onChangeField("birthDate", value)
                        }
                        onGenderChange={value =>
                            onChangeField("gender", value)
                        }
                        onBack={onBack}
                        onNext={onNext}
                    />
                );

            case 3:
                return (
                    <SportsAndRolesStep
                        variant={"onBoarding"}
                        sports={user.sports}
                        roles={user.roles}
                        errorMessage={fieldErrors.sports}
                        onToggleSport={toggleSport}
                        onToggleRole={toggleRole}
                        onBack={onBack}
                        onNext={onNext}
                    />
                );

            case 4:
                return (
                    <LocationStep
                        location={user.location}
                        errorMessage={fieldErrors.location}
                        finalError={apiError}
                        isLoading={isSubmitting}
                        onLocationChange={value =>
                            onChangeField("location", value)
                        }
                        onBack={onBack}
                        onNext={onNext}
                    />
                );

            default:
                return null;
        }
    }


    return renderStep();

}