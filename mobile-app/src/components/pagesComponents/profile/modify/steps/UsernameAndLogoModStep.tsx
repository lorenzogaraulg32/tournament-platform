import {StyleSheet, View} from "react-native";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import LogoField from "@/src/components/common/images/LogoField";
import OnBoardingContainer from "@/src/components/pagesComponents/auth/onboarding/OnBoardingContainer";
import OnBoardingNavigationButtons from "@/src/components/pagesComponents/onBoarding/OnBoardingNavigationButtons";
import type {SelectedImage} from "@/src/services/imagesService";
import {colors} from "@/src/constants/theme";
import FormInputField from "@/src/components/common/forms/FormInputField";

type UsernameAndLogoStepProps = {
    username: string;
    profileLogo: SelectedImage | null;
    usernameError?: string;
    profileLogoError?: string;
    onUsernameChange: (value: string) => void;
    onProfileLogoChange: (value: SelectedImage | null) => void;
    onBack: () => void;
    onNext: () => void;
    onRemove: () => void;
    local: boolean
    existingLogoSource?: string;
};

export default function UsernameAndLogoModStep({
                                                   username,
                                                   profileLogo,
                                                   usernameError,
                                                   profileLogoError,
                                                   onUsernameChange,
                                                   onProfileLogoChange,
                                                   onBack,
                                                   onNext,
                                                   onRemove,
                                                   local,
                                                   existingLogoSource,
                                               }: UsernameAndLogoStepProps) {
    return (
        <OnBoardingContainer
            step={2}
            label="Completa la registrazione"
            content={
                <AuthContent style={styles.inputFieldsContainer}>
                    <View>
                        <FormInputField
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
                            value={profileLogo}
                            existingLogoSource={existingLogoSource}
                            placeholderIcon="person-outline"
                            onRemove={onRemove}
                            onChange={onProfileLogoChange}
                            errorMessage={profileLogoError}
                            local={local}
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


export const styles = StyleSheet.create({
    inputFieldsContainer: {
        gap: 8,
    },


    sectionLabel: {
        marginTop: 14,
        marginBottom: 3,
        marginLeft: 10,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "800",
        color: "#FFFFFF",
        textAlign: "left",
    },


    fieldError: {
        marginTop: 6,
        fontSize: 13,
        color: colors.error,
    },

    dateField: {
        minHeight: 52,
        justifyContent: "center",
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#D0EBDD",
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
    },

    dateFieldError: {
        borderColor: colors.error,
    },

    dateText: {
        fontSize: 15,
        color: "#1C1C1C",
    },

    datePlaceholder: {
        color: "#8A8A8A",
    },

    loadingContainer: {
        height: 100,
        alignItems: "center",
        justifyContent: "space-evenly",
    },

    loadingText: {
        fontWeight: "800",
        color: "#FFFFFF",
        fontSize: 16,
    },
});

