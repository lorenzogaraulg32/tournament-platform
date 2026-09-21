import {View} from "react-native";
import type {SelectedImage} from "@/src/services/imagesService";
import type {Sport, SportRole,} from "@/src/services/users/userConstants";

import type {ProfileFieldErrors, ProfileFormData,} from "./ModifyProfileScreen";

import NameAndSurnameStep from "@/src/components/pagesComponents/profile/modify/steps/NameAndSurnameStep";
import UsernameAndLogoStep from "@/src/components/pagesComponents/profile/modify/steps/UsernameAndLogoStep";
import LocationStep from "@/src/components/pagesComponents/profile/modify/steps/LocationStep";
import SportsAndRolesStep from "@/src/components/pagesComponents/profile/modify/steps/SportsAndRolesStep";

import FormLayout from "@/src/components/common/forms/ layout/FormLayout";
import FormContent from "@/src/components/common/forms/ layout/FormContent";
import HeaderForm from "@/src/components/common/headers/HeaderForm";
import FormProgressBar from "@/src/components/common/forms/components/FormProgressBar";

export type ProfileEditStep = 0 | 1 | 2 | 3;

export const FIRST_STEP: ProfileEditStep = 0;
export const LAST_STEP: ProfileEditStep = 3;
export const STEPS: ProfileEditStep[] = [0, 1, 2, 3];

type ModifyProfilePageProps = {
    profile: ProfileFormData;
    logo: SelectedImage | null;
    existingLogoSource?: string;

    currentStep: ProfileEditStep;
    fieldErrors: ProfileFieldErrors;
    apiError: string;
    isSubmitting: boolean;

    onChangeField: <K extends keyof ProfileFormData>(
        field: K,
        value: ProfileFormData[K],
    ) => void;

    onChangeLogo: (logo: SelectedImage | null) => void;
    onRemoveLogo: () => void;
    onToggleSport: (sport: Sport) => void;
    onToggleRole: (sport: Sport, role: SportRole) => void;
    onBack: () => void;
    onNext: () => Promise<void>;
};

export default function ModifyProfilePage({
                                              profile,
                                              logo,
                                              existingLogoSource,
                                              currentStep,
                                              fieldErrors,
                                              apiError,
                                              isSubmitting,
                                              onChangeField,
                                              onChangeLogo,
                                              onRemoveLogo,
                                              onToggleSport,
                                              onToggleRole,
                                              onBack,
                                              onNext,
                                          }: ModifyProfilePageProps) {
    function renderStep() {
        switch (currentStep) {
            case 0:
                return (
                    <NameAndSurnameStep
                        variant="profile"
                        firstName={profile.firstName}
                        lastName={profile.lastName}
                        onChangeFirstName={value =>
                            onChangeField("firstName", value)
                        }
                        onChangeLastName={value =>
                            onChangeField("lastName", value)
                        }
                        firstNameError={fieldErrors.firstName}
                        lastNameError={fieldErrors.lastName}
                        disabled={isSubmitting}
                    />
                );

            case 1:
                return (
                    <UsernameAndLogoStep
                        variant="profile"
                        username={profile.username}
                        logo={logo}
                        existingLogoSource={existingLogoSource}
                        onChangeUsername={value =>
                            onChangeField("username", value)
                        }
                        onChangeLogo={onChangeLogo}
                        onRemoveLogo={onRemoveLogo}
                        usernameError={fieldErrors.username}
                        logoError={fieldErrors.logo}
                        disabled={isSubmitting}
                    />
                );

            case 2:
                return (
                    <LocationStep
                        variant="profile"
                        value={profile.location}
                        onChange={value =>
                            onChangeField("location", value)
                        }
                        errorMessage={fieldErrors.location}
                        disabled={isSubmitting}
                    />
                );

            case 3:
                return (
                    <SportsAndRolesStep
                        variant="profile"
                        sports={profile.sports}
                        roles={profile.roles}
                        onToggleSport={onToggleSport}
                        onToggleRole={onToggleRole}
                        sportsError={fieldErrors.sports}
                        rolesError={fieldErrors.roles}
                        disabled={isSubmitting}
                    />
                );
        }
    }

    const formStep =
        currentStep === FIRST_STEP
            ? "first"
            : currentStep === LAST_STEP
                ? "last"
                : "middle";

    return (
        <FormLayout
            variant="profile"
            header={
                <HeaderForm
                    variant="profile"
                    title="Modifica il profilo"
                    subtitle="Aggiorna le tue informazioni e gli sport che pratichi."
                />
            }
        >
            <FormProgressBar
                variant="profile"
                step={currentStep}
                totalSteps={STEPS.length}
            />

            <FormContent
                handleBack={onBack}
                handleNext={onNext}
                isSubmitting={isSubmitting}
                step={formStep}
                apiError={apiError}
            >
                <View pointerEvents={isSubmitting ? "none" : "auto"}>
                    {renderStep()}
                </View>
            </FormContent>
        </FormLayout>
    );
}