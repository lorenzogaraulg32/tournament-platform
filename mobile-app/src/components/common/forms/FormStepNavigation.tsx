import {StyleSheet, View} from "react-native";
import ActionButton from "@/src/components/common/buttons/ActionButton";
import {Variant} from "@/src/constants/palette/PaletteManager";

interface stepNavigationProps {
    onNext?: () => void
    onBack?: () => void
    nextVariant: Variant
    backVariant?: Variant
    nextLabel?: string
    backLabel?: string,
    loading?: boolean
}


export default function FormStepNavigation({
                                               onNext,
                                               onBack,
                                               nextVariant,
                                               backVariant = "standard",
                                               nextLabel = "Continua",
                                               backLabel = "Indietro",
                                               loading = false
                                           }: stepNavigationProps) {


    return (
        <View
            style={styles.container}>

            {onBack && (
                <View style={styles.backContainer}>
                    <ActionButton
                        label={backLabel}
                        onPress={onBack}
                        paletteVariant={backVariant}
                        disabled={loading}
                    />
                </View>
            )}

            {onNext && <View style={styles.nextContainer}>
                <ActionButton
                    label={nextLabel}
                    onPress={onNext}
                    paletteVariant={nextVariant}
                    disabled={loading}
                />
            </View>
            }

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginVertical: 20,
    },

    backContainer: {
        flex: 1,
    },

    nextContainer: {
        flex: 2,
    },
});