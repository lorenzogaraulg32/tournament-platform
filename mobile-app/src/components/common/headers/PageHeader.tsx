import {ImageBackground, ImageSourcePropType, StyleSheet, Text} from "react-native";

type PageHeaderVariant =
    | "green"
    | "orange";

type PageHeaderProps = {
    variant: PageHeaderVariant;
    label: string;
    title: string;
    subtitle: string;
};

type HeaderVariantConfig = {
    background: ImageSourcePropType;
};

const variants: Record<PageHeaderVariant, HeaderVariantConfig> = {

    green: {
        background: require("../../../../assets/images/backgrounds/greenBackground.png"),
    },

    orange: {
        background: require("../../../../assets/images/backgrounds/orangeBackground.png"),
    },

};

export default function PageHeader({
                                       variant,
                                       label,
                                       title,
                                       subtitle
                                   }: PageHeaderProps) {

    const config = variants[variant];

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
        minHeight: 180,

        paddingHorizontal: 28,
        paddingTop: 50,
        paddingBottom: 42,

        justifyContent: "center",
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