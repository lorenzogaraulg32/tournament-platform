import {View} from "react-native";
import type {Variant} from "@/src/constants/PaletteManager";
import type {SelectedImage} from "@/src/services/imagesService";
import FormInputField from "@/src/components/common/forms/components/FormInputField";
import FormImageField from "@/src/components/common/forms/components/FormImageField";

type UsernameAndLogoStepProps = {
    variant: Variant;
    username: string;
    logo: SelectedImage | null;
    existingLogoSource?: string;
    onChangeUsername: (value: string) => void;
    onChangeLogo: (value: SelectedImage | null) => void;
    onRemoveLogo: () => void;
    usernameError?: string;
    logoError?: string;
    disabled?: boolean;
};

export default function UsernameAndLogoStep({
                                                variant,
                                                username,
                                                logo,
                                                existingLogoSource,
                                                onChangeUsername,
                                                onChangeLogo,
                                                onRemoveLogo,
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
                existingLogoSource={existingLogoSource}
                onChange={onChangeLogo}
                onRemove={onRemoveLogo}
                errorMessage={logoError}
                disabled={disabled}
                local={logo !== null}
            />
        </View>
    );
}