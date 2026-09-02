import {StyleSheet, Text, View} from "react-native";
import ButtonSolid from "@/src/components/common/buttons/ButtonSolid";
import {ReactNode} from "react";


type FormContentProps = {
    step: "first" | "middle" | "last"
    children: ReactNode
    isSubmitting: boolean,
    handleBack: () => void,
    handleNext: () => void,
    apiError? : string,
}


export default function FormContent({step, children, isSubmitting, handleBack, handleNext, apiError}: FormContentProps) {
    return (
        <View style={styles.formContainer}>
        {children}

        {step === "last" && apiError && (
            <Text style={styles.submitError}>
                {apiError}
            </Text>
        )}

        <View style={styles.btnContainer}>
            {step !== "first" && (
                <ButtonSolid
                    style={styles.btn}
                    onPress={handleBack}
                    disabled={isSubmitting}
                    variant="buttonLogin"
                    textVariant="textLogin"
                    text="Indietro"
                />
            )}

            <ButtonSolid
                style={styles.btn}
                variant="buttonRegister"
                textVariant="textRegister"
                onPress={handleNext}
                disabled={isSubmitting}
                text={
                    step === "last"
                        ? "Crea"
                        : "Avanti"
                }
            />
        </View>
    </View>)
}


const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
    },

    stepContainer: {
        flex: 1,
    },

    submitError: {
        marginBottom: 10,
        color: "#B42318",
        fontSize: 14,
        textAlign: "center",
    },

    btnContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "stretch",
        gap: 12,
        marginTop: 20,
    },

    btn: {
        flex: 1,
        minWidth: 0,
    },
});