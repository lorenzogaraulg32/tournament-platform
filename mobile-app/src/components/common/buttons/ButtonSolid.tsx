import {Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle} from "react-native";
import {paletteVariants, Variant} from "@/src/constants/PaletteManager";


type ButtonSolidProps = Omit<PressableProps, "style"> & {
    text: string;
    variant: Variant;
    style?: StyleProp<ViewStyle>;
};


export default function ButtonSolid({
                                        text,
                                        variant = "standard",
                                        style,
                                        ...props
                                    }: ButtonSolidProps) {


    const palette = paletteVariants[variant].palette

    return (
        <Pressable
            style={({pressed}) => [
                styles.base,
                {
                    backgroundColor: palette.btnBK
                },
                pressed && styles.pressed,
                style,
            ]}
            {...props}
        >
            <Text style={[
                styles.textBase,
                {
                    color: palette.btnText
                }
            ]}>
                {text}
            </Text>

        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        width: "100%",
        height: 48,
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

    pressed: {
        transform: [{scale: 0.98}],
        opacity: 0.9,
    },
});