import {Pressable, StyleSheet, Text, View} from "react-native";

import {useState} from "react";
import {colors} from "@/src/constants/theme";
import {Sport} from "@/src/services/users/userConstants";
import {FORMATIONS_BY_SPORT} from "@/src/components/pagesComponents/teams/field/consts/FieldConst";

type ModuleSelectorProps = {
    sport: Sport
    value: string | null
    onChange: (id: string) => void
}


export default function FormationSelector({sport, value, onChange}: ModuleSelectorProps) {

    const formations = FORMATIONS_BY_SPORT[sport] ?? [];

    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    const selectedFormation = formations.find(
        (option) => option.name === value
    );

    function selectFormation(id: string) {
        onChange(id)
        setIsSelectorOpen(false);
    }

    return (
        <View style={styles.selectorContainer}>
            <Pressable
                onPress={() => setIsSelectorOpen((previous) => !previous)}
                accessibilityRole="button"
                accessibilityLabel={`Modulo: ${selectedFormation?.label}`}
                disabled={formations.length === 0}
                accessibilityState={{expanded: isSelectorOpen}}
                style={styles.moduleSelector}
            >
                <Text style={styles.selectorText}>
                    {selectedFormation?.label}
                </Text>

                <Text style={styles.selectorText}>
                    {isSelectorOpen ? "▴" : "▾"}
                </Text>
            </Pressable>

            {isSelectorOpen && (
                <View style={styles.moduleOptions}>
                    {formations.map((option) => {
                        const selected = selectedFormation?.name === option.name;

                        return (
                            <Pressable
                                key={option.name}
                                onPress={() => selectFormation(option.name)}
                                accessibilityRole="radio"
                                accessibilityState={{checked: selected}}
                                style={[
                                    styles.moduleOption,
                                    selected && styles.moduleOptionSelected,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        selected && styles.optionTextSelected,
                                    ]}
                                >
                                    {option.label}
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
        alignSelf: "flex-start",
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
        left: 0,
        width: 120,

        padding: 4,
        gap: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(8, 105, 72, 0.20)",
        backgroundColor: "#FFFFFF",

        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
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


