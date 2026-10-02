import {View} from "react-native";
import AuthTextField from "@/src/components/pagesComponents/auth/AuthTextField";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import FormImageField from "@/src/components/common/forms/components/FormImageField";
import OnBoardingContainer from "@/src/components/pagesComponents/auth/onboarding/OnBoardingContainer";
import OnBoardingNavigationButtons from "@/src/components/pagesComponents/profile/onBoarding/misc/OnBoardingNavigationButtons";
import {onboardingStepStyles as styles} from "@/src/components/pagesComponents/profile/onBoarding/misc/onboardingStepStyles"
import {Media} from "@/src/services/mediaService";

type UsernameAndLogoStepProps = {
    username: string;
    avatar: Media | null;
    usernameError?: string;
    profileLogoError?: string;
    onUsernameChange: (username: string) => void;
    onAvatarChange: (avatar: Media | null) => void;
    onBack: () => void;
    onNext: () => void;
};

export default function UsernameAndAvatarStep({
                                                username,
                                                avatar,
                                                usernameError,
                                                profileLogoError,
                                                onUsernameChange,
                                                onAvatarChange,
                                                onBack,
                                                onNext,
                                            }: UsernameAndLogoStepProps) {
    return (
        <OnBoardingContainer
            step={2}
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

                        <FormImageField
                            variant="onBoarding"
                            label="Foto profilo"
                            optional
                            value={avatar}
                            onChange={onAvatarChange}
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
