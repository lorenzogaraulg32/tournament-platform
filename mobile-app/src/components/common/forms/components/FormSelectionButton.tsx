import {Pressable, StyleSheet, Text} from "react-native";
import {paletteVariants, type Variant} from "@/src/constants/PaletteManager";

type FormSelectionButtonProps = {
    label: string;
    variant: Variant;
    selected: boolean;
    onPress: () => void;
    accessibilityRole?: "radio" | "checkbox";
};


export default function FormSelectionButton({
                                                label,
                                                variant,
                                                selected,
                                                onPress,
                                                accessibilityRole = "checkbox",
                                            }: FormSelectionButtonProps) {
    const {palette} = paletteVariants[variant];

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole={accessibilityRole}
            accessibilityState={{checked: selected}}
            style={[
                styles.button,
                {
                    backgroundColor: selected
                        ? palette.defaultColorBK
                        : "#FFFFFF",
                    borderColor: selected
                        ? palette.defaultColor
                        : palette.borderColor,
                },
            ]}
        >
            <Text
                style={[
                    styles.label,
                    {
                        color: selected
                            ? palette.defaultColor
                            : palette.labelColor,
                    },
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 48,
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: "center",
        borderRadius: 14,
        borderWidth: 1,
    },
    label: {
        fontSize: 15,
        fontWeight: "500",
    },
});