import {ImageBackground, StyleSheet} from "react-native";
import {ReactNode} from "react";
import {type BKVariant, variants} from "@/src/constants/PaletteManager";

type PageHeaderProps = {
    variant: BKVariant;
    children: ReactNode;
};


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