import {StyleSheet, Text, View} from "react-native";
import FormStepNavigation from "@/src/components/common/forms/FormStepNavigation";
import React, {useState} from "react";
import {ExternalProvider} from "@/src/services/users/authService";
import GoogleAuthButton from "@/src/components/common/buttons/GoogleAuthButton";
import {colors} from "@/src/constants/theme";

type ExternalSectionProps = {
    onBack: () => void;
    unlinkExternal: () => void
    linkExternal: () => void
    externalProvider: ExternalProvider | null
    error?: string
};

export default function ExternalSection({
                                            onBack,
                                            linkExternal,
                                            unlinkExternal,
                                            externalProvider,
                                            error,
                                        }: ExternalSectionProps) {

    const [loading, setLoading] = useState(false)


    return (
        <View>
            {externalProvider ? (
                <>
                    <Text style={styles.label}>
                        Sei collegato con {externalProvider}
                    </Text>


                    <GoogleAuthButton
                        label={"Scollegati da Google"}
                        onPress={unlinkExternal}
                        loading={loading}
                    />
                </>
            ) : (
                <>
                    <Text style={styles.label}>
                        Per collegare il tuo account ad un provider esterno effettua l'accesso
                    </Text>

                    <GoogleAuthButton
                        onPress={linkExternal}
                        loading={loading}
                    />
                </>
            )}

            {error && <Text style={styles.error}>
                {error}
            </Text>
            }

            <FormStepNavigation
                nextLabel={"Indietro"}
                nextVariant={"profile"}
                onNext={() => {
                    onBack()
                }}
                loading={false}
            />

        </View>
    )
}


const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#111111",
        textAlign: "left",
        marginVertical: 10,
        marginHorizontal: 20
    },

    error: {
        marginTop: 20,
        flex: 1,
        color: colors.error,
        fontSize: 13,
        fontWeight: "500",
    },

});