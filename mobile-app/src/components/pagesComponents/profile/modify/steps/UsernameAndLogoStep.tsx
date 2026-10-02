import {View} from "react-native";
import type {Variant} from "@/src/constants/PaletteManager";
import type {Media} from "@/src/services/mediaService";
import FormInputField from "@/src/components/common/forms/components/FormInputField";
import FormImageField from "@/src/components/common/forms/components/FormImageField";

type UsernameAndLogoStepProps = {
    variant: Variant;
    username: string;
    logo: Media | null;
    onChangeUsername: (value: string) => void;
    onChangeLogo: (value: Media | null) => void;
    usernameError?: string;
    logoError?: string;
    disabled?: boolean;
};

export default function UsernameAndLogoStep({
                                                variant,
                                                username,
                                                logo,
                                                onChangeUsername,
                                                onChangeLogo,
                                                usernameError,
                                                logoError,
                                                disabled = false,
                                            }: UsernameAndLogoStepProps) {
    return (
        <View>
            <FormInputField
                variant={variant}
                label="Username"
                labelIconName="at-outline"
                placeholder="Inserisci il tuo username"
                value={username}
                onChangeText={onChangeUsername}
                errorMessage={usernameError}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!disabled}
            />

            <FormImageField
                variant={variant}
                value={logo}
                onChange={onChangeLogo}
                errorMessage={logoError}
                disabled={disabled}
            />
        </View>
    );
}