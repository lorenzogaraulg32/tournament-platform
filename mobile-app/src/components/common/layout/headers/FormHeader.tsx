import {ImageBackground, StyleSheet, Text, View} from "react-native";
import {router} from "expo-router";
import {paletteVariants, type Variant,} from "@/src/constants/palette/PaletteManager";
import BackButton from "@/src/components/common/buttons/BackButton";

type HeaderFormProps = {
    title: string;
    subtitle: string;
    variant: Variant;
};

export const HEADER_FORM_HEIGHT = 160


export default function FormHeader({
                                       title,
                                       subtitle,
                                       variant,
                                   }: HeaderFormProps) {

    const config = paletteVariants[variant];

    return (
        <ImageBackground
            source={config.background}
            style={styles.container}
        >

            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    {title}
                </Text>

                <Text style={styles.subtitle}>
                    {subtitle}
                </Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        height: HEADER_FORM_HEIGHT,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 60,
        paddingLeft: 20,
        gap: 20
    },


    textContainer: {
        flex: 1,
        minWidth: 0,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "800",
    },

    subtitle: {
        color: "rgba(255,255,255,0.82)",
        fontSize: 14,
        lineHeight: 22,
    },


    backButtonContainer: {
        position: "absolute",
        top: 0,
        left: -10
    }

});