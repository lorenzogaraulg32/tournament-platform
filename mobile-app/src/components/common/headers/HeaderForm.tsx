import {StyleSheet, Text, View} from "react-native";
import {router} from "expo-router";

import Picture from "@/src/components/common/images/Picture";
import {paletteVariants, type Variant,} from "@/src/constants/PaletteManager";
import BackButton from "@/src/components/common/buttons/BackButton";

type HeaderFormProps = {
    title: string;
    subtitle: string;
    variant: Variant;
};

export default function HeaderForm({
                                       title,
                                       subtitle,
                                       variant,
                                   }: HeaderFormProps) {
    const {palette} = paletteVariants[variant];

    return (
        <View style={styles.header}>
           <View style={ styles.backButtonContainer}>
            <BackButton onPress={router.back}/>
           </View>
            <View style={styles.content}>
                <View
                    style={[
                        styles.imageContainer,
                        {
                            borderColor: palette.defaultColor,
                            backgroundColor: palette.defaultColorBK,
                        },
                    ]}
                >
                    <Picture
                        logoUrl=""
                        variant={variant}
                        style={styles.logo}
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        {title}
                    </Text>

                    <Text style={styles.subtitle}>
                        {subtitle}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 35,
        gap: 16,
    },

    content: {
        flexDirection: "row",
        alignItems: "center",
        gap: 22,
    },

    imageContainer: {
        width: 112,
        height: 112,
        borderRadius: 56,
        borderWidth: 4,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        width: "100%",
        height: "100%",
    },

    textContainer: {
        flex: 1,
        minWidth: 0,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 25,
        fontWeight: "800",
    },

    subtitle: {
        marginTop: 8,
        color: "rgba(255,255,255,0.82)",
        fontSize: 16,
        lineHeight: 22,
    },
    backButtonContainer: {
        position: "absolute",
        top: -50,
        left: -25
    }

});