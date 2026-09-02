import {colors} from "@/src/constants/theme";
import React from "react";
import {StyleSheet, View} from "react-native";

type FormProgressBarProps = {
    step: number;
    totalSteps?: number;
};

export default function FormProgressBar({
                                            step,
                                            totalSteps = 5,
                                        }: FormProgressBarProps) {
    return (
        <View
            style={styles.wrapper}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={`Passaggio ${step} di ${totalSteps}`}
            accessibilityValue={{
                min: 1,
                max: totalSteps,
                now: step,
            }}
        >

            <View style={styles.container}>
                {Array.from({length: totalSteps}).map((_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < step;
                    const isCurrent = stepNumber === step;

                    return (
                        <React.Fragment key={stepNumber}>
                            <View
                                style={[
                                    styles.dot,
                                    isCompleted && styles.dotCompleted,
                                    isCurrent && styles.dotCurrent,
                                ]}
                            />

                            {index < totalSteps - 1 && (
                                <View
                                    style={[
                                        styles.bar,
                                        isCompleted && styles.barCompleted,
                                    ]}
                                />
                            )}
                        </React.Fragment>
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
    },


    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.orangeDefault,
        backgroundColor: "rgba(255, 255, 255)",
    },

    dotCompleted: {
        backgroundColor: colors.orangeDefault,
        borderWidth: 0,
    },

    dotCurrent: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 3,
        borderColor: colors.orangeDefault,
        backgroundColor: "#FFFFFF",
    },

    bar: {
        flex: 1,
        height: 5,
        marginHorizontal: 6,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.orangeDefault,
        backgroundColor: "rgba(255, 255, 255)",
    },

    barCompleted: {
        borderWidth: 0,
        backgroundColor: colors.orangeDefault,
    },
});