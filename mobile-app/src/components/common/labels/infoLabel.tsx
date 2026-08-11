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
                <Ionicons
                    style={styles.icon}
                    name={labelIconName}
                    size={22}
                    color={colors.background}
                />
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
    },

    icon: {
        color: colors.labelInfo,
        marginTop: 3,
    },


});