import {ImageBackground, ImageSourcePropType, StyleSheet} from "react-native";
import {ReactNode} from "react";

type PageHeaderVariant = | "green" | "orange" | "purple" | "red";

type PageHeaderProps = {
    variant: PageHeaderVariant;
    children: ReactNode;
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

    purple: {
        background: require("../../../../assets/images/backgrounds/purpleBackground.png"),
    },

    red: {
        background: require("../../../../assets/images/backgrounds/redBackground.png"),
    },

};

/**
 *  Contenitore degli header, si occupa di gestire lo sfondo, dimensioni, margine e padding
 * @param variant colore del background
 * @param children

 * @constructor
 */

export default function HeaderContainer({
                                            variant,
                                            children,
                                        }: PageHeaderProps) {

    const config = variants[variant];

    return (
        <ImageBackground
            source={config.background}
            style={styles.container}
        >
            {children}
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

});