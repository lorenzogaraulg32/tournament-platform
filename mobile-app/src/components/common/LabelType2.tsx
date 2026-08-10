import {Alert, Pressable, StyleSheet, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {colors, fonts} from "@/src/constants/theme";


type LabelProps = {
    text: string;
    infoTitle?: string,
    infoMessage?: string,
    labelIconName?: keyof typeof Ionicons.glyphMap;
};

export default function LabelType2({
                                       text,
                                       infoTitle,
                                       infoMessage,
                                       labelIconName = "shield-outline",
                                   }: LabelProps) {
    return (

        <View style={styles.externalLabelContainer}>
            <View style={styles.labelContainer}>
                <Ionicons
                    style={styles.icon}
                    name={labelIconName}
                    size={18}
                    color={colors.background}
                />

                <Text style={styles.label}>
                    Bio
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
        </View>


    );


}


const styles = StyleSheet.create({


    externalLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
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
        backgroundColor: "rgba(200, 72, 10, 0.12)",
    },

    label: {
        color: "#1C1C1C",
        fontSize: fonts.label,
        fontWeight: "800",
    },

    infoIcon: {
        marginTop: 3,
        marginLeft: -5
    },

    icon: {
        marginTop: 3
    },


});