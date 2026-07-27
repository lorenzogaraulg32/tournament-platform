import {StyleSheet, Text, TextProps} from "react-native";
import {colors, fontSizes, fontWeights} from "@/src/constants/theme";

type ApptextVariant =
    "title"
    | "subtitle"
    | "body"
    | "caption"
    | "buttonRegisterText"
    | "buttonLoginText"
    | "fieldLabel"
    | "errorLabelInput";

type AppTextProps = TextProps & {
    text: string;
    variant?: ApptextVariant;
};

export default function AuthText({
                                    text,
                                    variant = "body",
                                    style,
                                    ...props
                                }: AppTextProps) {
    return (
        <Text style={[styles.base, styles[variant], style]} {...props}>
            {text}
        </Text>
    );
}


const styles = StyleSheet.create({
    base: {
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

    buttonRegisterText: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.orangeButtonText,
        textAlign: "center",
    },

    buttonLoginText: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.whiteButtonText,
        textAlign: "center",
    },

    fieldLabel: {
        fontSize: fontSizes.md,
        lineHeight: 20,
        fontWeight: fontWeights.semiBold,
        color: colors.textPrimary,
        marginLeft: 10,
        marginBottom: 8,
        textAlign: "left"
    },

    errorLabelInput: {
        marginTop: 6,
        marginLeft: 10,
        fontSize: fontSizes.sm,
        lineHeight: 18,
        fontWeight: fontWeights.medium,
        color: colors.error,
        textAlign: "left",
    }

});