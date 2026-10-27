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
    hasInternalPassword: boolean
};

export default function ChangeEmailSection({
                                               onBack,
                                               oldEmail,
                                               changeEmail,
                                               loading,
                                               error,
                                               hasInternalPassword
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
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!loading}
            />
            {hasInternalPassword ?
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
                :
                <View style={styles.infoContainer}>
                    <Text style={[
                        styles.infoText,
                        {color: palette.labelSecondaryColor}
                    ]}>
                        Per modificare l'indirizzo email devi prima impostare una password JoinCup, così potrai
                        continuare ad accedere anche dopo la modifica.
                    </Text>
                </View>

            }
            <FormStepNavigation
                onNext={async () => {
                    if (hasInternalPassword) {
                        await changeEmail(email)
                        onBack()
                    }
                }}

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