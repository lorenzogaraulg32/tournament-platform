import { View } from "react-native";
import type { Variant } from "@/src/constants/PaletteManager";
import FormInputField from "@/src/components/common/forms/components/FormInputField";

type NameAndSurnameStepProps = {
    variant: Variant;
    firstName: string;
    lastName: string;
    onChangeFirstName: (value: string) => void;
    onChangeLastName: (value: string) => void;
    firstNameError?: string;
    lastNameError?: string;
    disabled?: boolean;
};

export default function NameAndSurnameStep({
                                               variant,
                                               firstName,
                                               lastName,
                                               onChangeFirstName,
                                               onChangeLastName,
                                               firstNameError,
                                               lastNameError,
                                               disabled = false,
                                           }: NameAndSurnameStepProps) {
    return (
        <View>
            <FormInputField
                variant={variant}
                label="Nome"
                labelIconName="person-outline"
                placeholder="Inserisci il tuo nome"
                value={firstName}
                onChangeText={onChangeFirstName}
                errorMessage={firstNameError}
                autoCapitalize="words"
                editable={!disabled}
            />

            <FormInputField
                variant={variant}
                label="Cognome"
                labelIconName="person-outline"
                placeholder="Inserisci il tuo cognome"
                value={lastName}
                onChangeText={onChangeLastName}
                errorMessage={lastNameError}
                autoCapitalize="words"
                editable={!disabled}
            />
        </View>
    );
}