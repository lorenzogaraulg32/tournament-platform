import {StyleSheet, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {colors, fonts} from "@/src/constants/theme";


type LabelProps = {
    text: string;
    labelIconName?: keyof typeof Ionicons.glyphMap;
};

export default function InfoLabel({
                                      text,
                                      labelIconName = "shield-outline",
                                  }: LabelProps) {
    return (

        <View style={styles.externalLabelContainer}>
            <View style={styles.labelContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons
                        style={styles.iconGlow}
                        name={labelIconName}
                        size={24}
                        color="rgba(0, 168, 89, 0.15)"
                    />

                    <Ionicons
                        name={labelIconName}
                        size={24}
                        color={colors.labelInfo}
                    />
                </View>
                <Text style={styles.label}>
                    {text}
                </Text>

            </View>
        </View>


    );


}


const styles = StyleSheet.create({


    externalLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },

    label: {
        color: colors.labelInfo,
        fontSize: fonts.label,
        fontWeight: "800",
        textShadowColor: "rgba(0,86,40,0.18)",
        textShadowOffset: {
            width: 0,
            height: 2,
        },
        textShadowRadius: 4,
    },

    iconContainer: {
        position: "relative",
    },

    iconGlow: {
        position: "absolute",
        transform: [{ scale: 1.06 }],
    },

});