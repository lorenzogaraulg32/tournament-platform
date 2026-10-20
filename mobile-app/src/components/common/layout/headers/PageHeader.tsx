import {ImageBackground, StyleSheet, Text, View} from "react-native";
import {paletteVariants, Variant} from "@/src/constants/palette/PaletteManager";


type HeaderPageProps = {
    label: string;
    title: string;
    subtitle: string;
    variant: Variant
};

export const HEADER_PAGE_HEIGHT = 180


/**
 * Header delle pagine principali dell'app

 * @param label
 * @param title
 * @param subtitle
 * @param variant
 * @constructor
 */
export default function PageHeader({
                                       label,
                                       title,
                                       subtitle,
                                       variant
                                   }: HeaderPageProps) {
    const config = paletteVariants[variant];

    return (
        <ImageBackground
            source={config.background}
            style={styles.container}
        >

            <Text style={styles.label}>
                {label}
            </Text>

            <Text style={styles.title}>
                {title}
            </Text>

            <Text style={styles.subtitle}>
                {subtitle}
            </Text>

        </ImageBackground>
    );
}


const styles = StyleSheet.create({

    container: {
        height: HEADER_PAGE_HEIGHT,
        paddingHorizontal: 25,
        paddingTop: 45,
    },

    label: {
        color: "rgba(255,255,255,0.78)",
        fontSize: 14,
        fontWeight: "600",

        marginBottom: 4,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "800",
    },

    subtitle: {
        color: "rgba(255,255,255,0.90)",
        fontSize: 14,
        lineHeight: 20,

        marginTop: 6,
    },

});