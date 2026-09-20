import {Alert, Pressable, StyleSheet, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {colors, fonts} from "@/src/constants/theme";


type LabelProps = {
    text: string;
    variant?: "team" | "profile";
    optional?: boolean,
    infoTitle?: string,
    infoMessage?: string,
    labelIconName?: keyof typeof Ionicons.glyphMap;
};

export default function FormLabel({
                                      text,
                                      optional = false,
                                      variant = "team",
                                      infoTitle,
                                      infoMessage,
                                      labelIconName = "help-outline",
                                  }: LabelProps) {
    return (
        <View style={styles.externalLabelContainer}>

            <View style={styles.labelContainer}>
                <View style={[styles.iconContainer, variant === "profile" && styles.profileIconContainer]}>
                    <Ionicons
                        name={labelIconName}
                        size={22}
                        color={variant === "profile" ? colors.redDefaultBK : colors.redDefaultBK}
                    />
                </View>

                <Text style={styles.label}>
                    {text}
                </Text>
                {infoTitle && infoMessage && <Pressable
                    onPress={() =>
                        Alert.alert(
                            infoTitle,
                            infoMessage,
                            [{text: "Ho capito"}]
                        )
                    }
                    hitSlop={10}
                    accessibilityRole="button"
                >
                    <Ionicons
                        name="information-circle-outline"
                        size={20}
                        color="#9A9A9A"
                        style={styles.infoIcon}
                    />
                </Pressable>}
            </View>

            {optional && (
                <Text style={styles.optionalText}>
                    Opzionale
                </Text>

            )}


        </View>
    );


}


const styles = StyleSheet.create({


    externalLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 9,

    },

    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    iconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 20,
        backgroundColor:"rgba(200, 72, 10, 0.12)",
    },

    profileIconContainer: {
        backgroundColor: colors.redDefaultBK,
    },

    label: {
        color: colors.label,
        fontSize: fonts.label,
        fontWeight: "800",
    },

    optionalText: {
        color: "#a8a8a8",
    },

    extraContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        gap: 10,
    },
    infoIcon: {
        marginTop: 3,
        marginLeft: -5
    }


});