import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    ViewStyle
} from "react-native";
import {ReactNode} from "react";

type AppButtonVariant = "register" | "login" | "primary" | "secondary";

type AppButtonsProps = Omit<PressableProps, "style"> & {
    children: ReactNode;
    variant?: AppButtonVariant;
    style?: StyleProp<ViewStyle>;
};

export default function AppButton({
                                      children,
                                      variant = "primary",
                                      style,
                                      ...props
                                  }: AppButtonsProps) {
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
            {children}
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
    },

    register: {
        backgroundColor: "#FFFFFF",

        shadowColor: "#000",
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.20,
        shadowRadius: 12,
        elevation: 8,
    },

    login: {
        backgroundColor: "#d97b00",
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.45)",

        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 6,
    },

    primary: {
        backgroundColor: "#FFFFFF",
    },

    secondary: {
        backgroundColor: "#102A43",
    },

    pressed: {
        transform: [{scale: 0.98}],
        opacity: 0.9,
    },
});