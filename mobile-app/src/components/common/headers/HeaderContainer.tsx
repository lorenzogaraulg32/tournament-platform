import {ImageBackground, StyleSheet} from "react-native";
import {ReactNode} from "react";
import {variants, type BKVariant} from "@/src/constants/bkManager";

type PageHeaderProps = {
    variant: BKVariant;
    children: ReactNode;
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