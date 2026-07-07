import {StyleSheet, Text, TextProps} from "react-native";
import {colors, fontSizes, fontWeights} from "@/src/constants/theme";
import {ReactNode} from "react";

type ApptextVariant = "title" | "subtitle" | "body" | "caption" | "buttonRegister" | "buttonLogin";

type AppTextProps = TextProps & {
    children: ReactNode;
    variant?: ApptextVariant;
};

export default function AppText({
                                    children,
                                    variant = "body",
                                    style,
                                    ...props
                                }: AppTextProps) {
    return (
        <Text style={[styles.base, styles[variant], style]} {...props}>
            {children}
        </Text>
    );
}


const styles = StyleSheet.create({
    base: {
        color: colors.textPrimary,
        textAlign: "center"
    },
    title: {
        fontSize: fontSizes.xxl,
        fontWeight: fontWeights.bold,
    },

    subtitle: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
    },

    body: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.regular,
    },

    caption: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.regular,
        color: colors.textSecondary,
    },

    buttonRegister: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: "#007B43",
        textAlign: "center",
    },

    buttonLogin: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: "#FFFFFF",
        textAlign: "center",
    },
});