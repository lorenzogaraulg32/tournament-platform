import {Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle} from "react-native";
import {ReactNode} from "react";
import {colors} from "../../constants/theme"

type AppButtonVariant = "buttonRegister" | "buttonLogin" | "primary" | "secondary" | "logout";

type AppButtonProps = Omit<PressableProps, "style"> & {
    children: ReactNode;
    variant?: AppButtonVariant;
    style?: StyleProp<ViewStyle>;
};

export default function AuthButton({
                                       children,
                                       variant = "primary",
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

    buttonRegister: {
        backgroundColor: colors.orangeButtonBackground,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.20,
        shadowRadius: 12,
        elevation: 8,
    },

    buttonLogin: {
        backgroundColor: colors.whiteButtonBackground,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 6,
    },


    logout: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#B3261E",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.16)",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },

    primary: {},

    secondary: {},

    pressed: {
        transform: [{scale: 0.98}],
        opacity: 0.9,
    },
});