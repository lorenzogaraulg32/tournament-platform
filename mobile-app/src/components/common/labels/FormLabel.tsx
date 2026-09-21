import {Alert, Pressable, StyleSheet, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {paletteVariants, Variant} from "@/src/constants/PaletteManager";


type LabelProps = {
    text: string;
    variant: Variant;
    optional?: boolean,
    infoTitle?: string,
    infoMessage?: string,
    labelIconName?: keyof typeof Ionicons.glyphMap;
};

export default function FormLabel({
                                      text,
                                      optional = false,
                                      variant,
                                      infoTitle,
                                      infoMessage,
                                      labelIconName = "help-outline",
                                  }: LabelProps) {

    const {palette} = paletteVariants[variant];

    return (
        <View style={styles.externalLabelContainer}>
            <View style={styles.labelContainer}>
                <View
                    style={[
                        styles.iconContainer,
                        {backgroundColor: palette.defaultColorBK},
                    ]}
                >
                    <Ionicons
                        name={labelIconName}
                        size={22}
                        color={palette.defaultColor}
                    />
                </View>

                <Text
                    style={{
                        color: palette.labelColor,
                        fontSize: palette.labelFontSize,
                        fontWeight: palette.labelFontWeight,
                    }}
                >
                    {text}
                </Text>

                {!!infoTitle && !!infoMessage && (
                    <Pressable
                        onPress={() =>
                            Alert.alert(
                                infoTitle,
                                infoMessage,
                                [{text: "Ho capito"}],
                            )
                        }
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel={`Informazioni su ${text}`}
                    >
                        <Ionicons
                            name="information-circle-outline"
                            size={20}
                            color={palette.labelSecondaryColor}
                            style={styles.infoIcon}
                        />
                    </Pressable>
                )}
            </View>

            {optional && (
                <Text style={{color: palette.labelSecondaryColor}}>
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
    },

    infoIcon: {
        marginTop: 3,
        marginLeft: -5,
    },
});