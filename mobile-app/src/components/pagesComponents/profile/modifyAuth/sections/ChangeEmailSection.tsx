import {StyleSheet, Text, View} from "react-native";
import FormInputField from "@/src/components/common/forms/fileds/FormInputField";
import FormStepNavigation from "@/src/components/common/forms/FormStepNavigation";
import React, {useState} from "react";
import {paletteVariants} from "@/src/constants/palette/PaletteManager";

type ChangeEmailSectionProps = {
    error?: string;
    loading: boolean
    onBack: () => void;

    oldEmail: string
    changeEmail: (email: string) => Promise<void>;

};

export default function ChangeEmailSection({
                                               onBack,
                                               oldEmail,
                                               changeEmail,
                                               loading,
                                               error
                                           }: ChangeEmailSectionProps) {

    const [email, setEmail] = useState("");
    const {palette} = paletteVariants["profile"];
    return (
        <View>
            <FormInputField
                variant={"profile"}
                label="Email"
                labelIconName="mail"
                placeholder={oldEmail}

                onChangeText={(email: string) => {
                    setEmail(email)
                }}
                errorMessage={error || ""}
                autoCapitalize="words"
                editable={true}
            />
            <View style={styles.infoContainer}>
                <Text style={[
                    styles.infoText,
                    {color: palette.labelSecondaryColor}
                ]}>
                    Modificando il tuo indirizzo email, gli eventuali
                    provider esterni collegati verranno automaticamente
                    scollegati. Potrai collegarli nuovamente utilizzando
                    un account con la stessa email.
                </Text>
            </View>
            <FormStepNavigation
                onNext={async () => await changeEmail(email)}
                nextLabel={"Modifica"}
                nextVariant={"profile"}
                onBack={onBack}
                loading={loading}
            />

        </View>
    )
}


const styles = StyleSheet.create({
    infoContainer: {
        paddingHorizontal: 8,
        marginVertical: 16,
    },

    infoText: {
        fontSize: 12,
        lineHeight: 18,
        textAlign: "center",
    },
});