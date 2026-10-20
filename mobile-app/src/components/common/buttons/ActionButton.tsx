import {paletteVariants, Variant} from "@/src/constants/palette/PaletteManager";
import React from "react";
import {ActivityIndicator, ImageSourcePropType, StyleProp, StyleSheet, Text, ViewStyle} from "react-native";
import {ButtonBackground, ButtonBase} from "@/src/components/common/buttons/ButtonBase";


type BackgroundVariant =
    | {
    variant?: "solid";
    imageSource?: never;
}
    | {
    variant: "image";
    imageSource: ImageSourcePropType;
};


interface actionButtonProps {
    label: string;

    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;

    paletteVariant?: Variant;

    backgroundVariant?: BackgroundVariant;

    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
}

/**
 * Pulsante di azione generico.
 *
 * Gestisce testo, icone, palette e stato di caricamento.
 * Delega a ButtonBase la presentazione del contenitore
 * e il feedback grafico alla pressione.
 */
export default function ActionButton({
                                         label,
                                         iconLeft,
                                         iconRight,
                                         paletteVariant = "standard",
                                         backgroundVariant,
                                         onPress,
                                         disabled,
                                         loading,
                                         style
                                     }: actionButtonProps) {

    //1 recupero della palette in base alla variante
    const palette = paletteVariants[paletteVariant].palette

    //2 distinzione dello sfondo in base a backgroundVariant
    const background: ButtonBackground =
        backgroundVariant?.variant === "image"
            ? {
                type: "image",
                source: backgroundVariant.imageSource
            }
            : {
                type: "solid",
                color: palette.btnBK
            }


    return (
        <ButtonBase
            background={background}
            onPress={onPress}
            disabled={disabled || loading}
            style={style}
        >
            {loading ? (
                <ActivityIndicator
                    size={"small"}
                    color={palette.btnText}
                />
            ) : (
                iconLeft
            )}

            <Text
                style={[styles.label,
                    {color: palette.btnText}]}
            >
                {label}

            </Text>

            {!loading && iconRight}
        </ButtonBase>

    )
}


const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: "700",
        lineHeight: 22,
        textAlign: "center",
    },
});
