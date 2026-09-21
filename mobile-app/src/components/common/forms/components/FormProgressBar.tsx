import { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { paletteVariants, type Variant } from "@/src/constants/PaletteManager";

type FormProgressBarProps = {
    step: number;
    totalSteps: number;
    variant: Variant;
};

export default function FormProgressBar({
                                            step,
                                            totalSteps,
                                            variant,
                                        }: FormProgressBarProps) {
    const { palette } = paletteVariants[variant];

    return (
        <View
            style={styles.wrapper}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={`Passaggio ${step + 1} di ${totalSteps}`}
            accessibilityValue={{
                min: 1,
                max: totalSteps,
                now: step + 1,
            }}
        >
            <View style={styles.container}>
                {Array.from({ length: totalSteps }, (_, index) => {
                    const isCompleted = index < step;
                    const isCurrent = index === step;

                    return (
                        <Fragment key={index}>
                            <View
                                style={[
                                    styles.dot,
                                    {
                                        borderColor: palette.defaultColor,
                                        backgroundColor: isCompleted
                                            ? palette.defaultColor
                                            : palette.defaultColorBK,
                                    },
                                    isCurrent && styles.dotCurrent,
                                ]}
                            />

                            {index < totalSteps - 1 && (
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            borderColor: palette.borderColor,
                                            backgroundColor: isCompleted
                                                ? palette.defaultColor
                                                : palette.defaultColorBK,
                                        },
                                    ]}
                                />
                            )}
                        </Fragment>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 12,
    },

    container: {
        width: "85%",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
    },

    dotCurrent: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 3,
    },

    bar: {
        flex: 1,
        height: 5,
        marginHorizontal: 6,
        borderRadius: 2,
        borderWidth: 1,
    },
});