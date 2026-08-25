import {View} from "react-native";
import AuthTextField from "@/src/components/pagesComponents/auth/AuthTextField";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import LogoField from "@/src/components/common/images/LogoField";
import OnBoardingContainer from "@/src/components/pagesComponents/auth/onboarding/OnBoardingContainer";
import OnBoardingNavigationButtons from "@/src/components/pagesComponents/onBoarding/OnBoardingNavigationButtons";
import {onboardingStepStyles as styles} from "@/src/components/pagesComponents/onBoarding/onboardingStepStyles"
import type {SelectedImage} from "@/src/services/users/imagesService";

type UsernameAndLogoStepProps = {
    username: string;
    profileLogo: SelectedImage | null;
    usernameError?: string;
    profileLogoError?: string;
    onUsernameChange: (value: string) => void;
    onProfileLogoChange: (value: SelectedImage | null) => void;
    onBack: () => void;
    onNext: () => void;
};

export default function UsernameAndLogoStep({
                                                username,
                                                profileLogo,
                                                usernameError,
                                                profileLogoError,
                                                onUsernameChange,
                                                onProfileLogoChange,
                                                onBack,
                                                onNext,
                                            }: UsernameAndLogoStepProps) {
    return (
        <OnBoardingContainer
            label="Completa la registrazione"
            content={
                <AuthContent style={styles.inputFieldsContainer}>
                    <View>
                        <AuthTextField
                            label="Username"
                            placeholder="Scegli il tuo username"
                            value={username}
                            onChangeText={onUsernameChange}
                            autoCapitalize="none"
                            autoCorrect={false}
                            errorMessage={usernameError}
                        />

                        <LogoField
                            variant="createUser"
                            label="Foto profilo"
                            placeholderIcon="person-outline"
                            optional
                            value={profileLogo}
                            onChange={onProfileLogoChange}
                            errorMessage={profileLogoError}
                        />
                    </View>

                    <OnBoardingNavigationButtons
                        onBack={onBack}
                        onNext={onNext}
                    />
                </AuthContent>
            }
        />
    );
}
