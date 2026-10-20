import {View} from "react-native";
import AuthTextField from "@/src/components/pagesComponents/auth/AuthTextField";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import FormImageField from "@/src/components/common/forms/fileds/FormImageField";
import OnBoardingContainer from "@/src/components/pagesComponents/profile/onBoarding/OnBoardingContainer";
import {
    onboardingStepStyles as styles
} from "@/src/components/pagesComponents/profile/onBoarding/misc/onboardingStepStyles"
import {Media} from "@/src/services/media/mediaService";
import FormStepNavigation from "@/src/components/common/forms/FormStepNavigation";

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
            step={1}
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

                    <FormStepNavigation
                        onNext={onNext}
                        nextVariant={"onBoarding"}
                        onBack={onBack}
                    />

                </AuthContent>
            }
        />
    );
}
