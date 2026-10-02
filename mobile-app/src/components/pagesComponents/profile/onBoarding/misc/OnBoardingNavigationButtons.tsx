import {StyleSheet, View} from "react-native";
import ButtonSolid from "@/src/components/common/buttons/ButtonSolid";

type OnBoardingNavigationButtonsProps = {
    onNext: () => void;
    onBack?: () => void;
    isLastStep?: boolean;
    disabled?: boolean;
};

export default function OnBoardingNavigationButtons({
    onNext,
    onBack,
    isLastStep = false,
    disabled = false,
}: OnBoardingNavigationButtonsProps) {
    const buttonStyle = onBack
        ? styles.button
        : styles.singleButton;

    return (
        <View style={styles.container}>
            {onBack && (
                <ButtonSolid
                    style={styles.button}
                    onPress={onBack}
                    disabled={disabled}
                    variant="buttonLogin"
                    textVariant="textLogin"
                    text="Indietro"
                />
            )}

            <ButtonSolid
                style={buttonStyle}
                onPress={onNext}
                disabled={disabled}
                variant="buttonRegister"
                textVariant="textRegister"
                text={isLastStep ? "Completa" : "Continua"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    button: {
        width: "45%",
    },

    singleButton: {
        width: "100%",
    },
});
