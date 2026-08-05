import {Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle} from "react-native";
import {colors} from "../../constants/theme"

type Variant = "base" | "buttonRegister" | "buttonLogin"

type TextVariant = "textBase" | "textRegister" | "textLogin"


type AppButtonProps = Omit<PressableProps, "style"> & {
    text: string;
    variant?: Variant;
    textVariant?: TextVariant;
    style?: StyleProp<ViewStyle>;
};

/**
 * Bottone a sfondo solido, selezionare le varianti
 * @param text Testo del pressable
 * @param variant variante
 * @param textVariant variante del testo
 * @param style stile aggiuntivo
 * @param props props aggiuntive
 */

export default function ButtonSolid({
                                        text,
                                        variant = "base",
                                        textVariant = "textBase",
                                        style,
                                        ...props
                                    }: AppButtonProps) {
    return (
        <Pressable
            style={({pressed}) => [
                styles.base,
                styles[variant],
                pressed && styles.pressed,
                style,
            ]}
            {...props}
        >
            <Text style={[
                styles.textBase,
                styles[textVariant]
            ]}>
                {text}
            </Text>

        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        width: "100%",
        height: 58,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.20,
        shadowRadius: 12,
        elevation: 3,
    },

    textBase: {
        fontSize: 16,
        fontWeight: 700,
        textAlign: "center",
    },

    buttonRegister: {
        backgroundColor: colors.orangeDefault,
    },

    textRegister: {
        color: "#ffffff",
    },

    buttonLogin: {
        backgroundColor: "#ffffff",
    },

    textLogin: {
        color: "#007B43",
    },


    pressed: {
        transform: [{scale: 0.98}],
        opacity: 0.9,
    },
});