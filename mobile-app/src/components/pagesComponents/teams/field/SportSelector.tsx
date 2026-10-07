import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { colors } from "@/src/constants/theme";
import { Sport, SPORT_LABELS } from "@/src/services/users/userDTO";

type SportSelectorProps = {
    sport: Sport;
    onChange: (sport: Sport) => void;
};

export default function SportSelector({
                                          sport,
                                          onChange,
                                      }: SportSelectorProps) {

    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    const selectedSport = SPORT_LABELS[sport];

    const sports = Object.values(Sport);

    function selectSport(newSport: Sport) {
        onChange(newSport);
        setIsSelectorOpen(false);
    }

    return (
        <View style={styles.selectorContainer}>
            <Pressable
                onPress={() =>
                    setIsSelectorOpen(previous => !previous)
                }
                accessibilityRole="button"
                accessibilityLabel={selectedSport}
                accessibilityState={{
                    expanded: isSelectorOpen,
                }}
                style={styles.moduleSelector}
            >
                <Text style={styles.selectorText}>
                    {selectedSport}
                </Text>

                <Text style={styles.selectorText}>
                    {isSelectorOpen ? "▴" : "▾"}
                </Text>
            </Pressable>

            {isSelectorOpen && (
                <View style={styles.moduleOptions}>
                    {sports.map(option => {
                        const selected = sport === option;

                        return (
                            <Pressable
                                key={option}
                                onPress={() => selectSport(option)}
                                accessibilityRole="radio"
                                accessibilityState={{
                                    checked: selected,
                                }}
                                style={[
                                    styles.moduleOption,
                                    selected &&
                                    styles.moduleOptionSelected,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        selected &&
                                        styles.optionTextSelected,
                                    ]}
                                >
                                    {SPORT_LABELS[option]}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    selectorContainer: {
        position: "relative",
        alignSelf: "flex-end",
        zIndex: 10,
    },

    moduleSelector: {
        minHeight: 36,
        paddingHorizontal: 10,
        paddingVertical: 6,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,

        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(8, 105, 72, 0.30)",
        backgroundColor: colors.greenBK,
    },

    moduleOptions: {
        position: "absolute",
        top: "100%",
        marginTop: 4,
        right: 0,
        width: 140,

        padding: 4,
        gap: 2,

        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(8, 105, 72, 0.20)",
        backgroundColor: "#FFFFFF",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },

    moduleOption: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 6,
    },

    moduleOptionSelected: {
        backgroundColor: "#086948",
    },

    selectorText: {
        color: "#07543A",
        fontSize: 13,
        fontWeight: "700",
    },

    optionText: {
        color: "#07543A",
        fontSize: 13,
        fontWeight: "600",
    },

    optionTextSelected: {
        color: "#FFFFFF",
    },
});