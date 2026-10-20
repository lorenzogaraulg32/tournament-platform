import {ImageBackground, ImageSourcePropType, Pressable, StyleProp, StyleSheet, ViewStyle} from "react-native";
import React from "react";


/**
 * Definisce la base dei bottoni utilizzati dall'applicazione
 * In particolare definisce l'aspetto e il comportamento grafico
 */


/**
 *  Definiamo i due tipi di background supportati, immagine e colore.
 *  */
export type ButtonBackground =
    | {
    type: "solid";
    color: string
}
    | {
    type: "image";
    source: ImageSourcePropType
}

/**
 * Interfaccia che definisce i props base di ogni pulsante
 */
export interface ButtonBaseProps {
    children: React.ReactNode;
    background: ButtonBackground;
    onPress?: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}


export function ButtonBase({
                               background,
                               children,
                               onPress,
                               disabled = false,
    style
                           }: ButtonBaseProps) {

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            accessibilityRole={"button"}
            style={({pressed}) => [
                styles.base,

                background.type === "solid" && {
                    backgroundColor: background.color
                },

                style,

                pressed && styles.pressed,
                disabled && styles.disabled
            ]}
        >
            {background.type === "image" && (
                <ImageBackground
                    source={background.source}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                    accessible={false}
                />
            )}
            {children}

        </Pressable>
    )


}


const styles = StyleSheet.create({

    base: {
        minHeight: 48,
        minWidth: 48,
        paddingHorizontal: 24,

        borderRadius: 999,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        columnGap: 8,

        overflow: "hidden",

        shadowColor: "#000",
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.20,
        shadowRadius: 12,
        elevation: 3,
    },

    pressed: {
        opacity: 0.85,
        transform: [{scale: 0.98}],
    },

    disabled: {
        opacity: 0.45,
    },

});

