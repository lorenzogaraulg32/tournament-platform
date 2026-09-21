import {useState} from "react";
import {type StyleProp, StyleSheet, Text, TextInput, type TextInputProps, type TextStyle, View,} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FormLabel from "@/src/components/common/labels/FormLabel";
import {paletteVariants, type Variant} from "@/src/constants/PaletteManager";
import {colors} from "@/src/constants/theme";

type FormInputFieldProps = TextInputProps & {
    label: string;
    variant: Variant;
    optional?: boolean;
    errorMessage?: string;
    labelIconName?: keyof typeof Ionicons.glyphMap;
    inputStyle?: StyleProp<TextStyle>;
    minLength?: number;
};

export default function FormInputField({
                                           label,
                                           variant,
                                           optional = false,
                                           errorMessage,
                                           labelIconName = "shield-outline",
                                           inputStyle,
                                           style,
                                           minLength = 0,
                                           maxLength,
                                           value,
                                           onFocus,
                                           onBlur,
                                           ...props
                                       }: FormInputFieldProps) {
    const {palette} = paletteVariants[variant];
    const [isFocused, setIsFocused] = useState(false);

    const length = value?.length ?? 0;
    const hasError = Boolean(errorMessage);

    return (
        <View style={styles.container}>
            <FormLabel
                text={label}
                variant={variant}
                optional={optional}
                labelIconName={labelIconName}
            />

            <TextInput
                placeholderTextColor={palette.labelSecondaryColor}
                selectionColor={palette.defaultColor}
                {...props}
                value={value}
                maxLength={maxLength}
                onFocus={event => {
                    setIsFocused(true);
                    onFocus?.(event);
                }}
                onBlur={event => {
                    setIsFocused(false);
                    onBlur?.(event);
                }}
                style={[
                    styles.input,
                    {
                        color: palette.labelColor,
                        borderColor: hasError
                            ? colors.error
                            : isFocused
                                ? palette.defaultColor
                                : palette.borderColor,
                        backgroundColor: hasError
                            ? colors.errorBK
                            : isFocused
                                ? "#FFFFFF"
                                : palette.defaultColorBK,
                    },
                    inputStyle,
                    style,
                ]}
            />

            <View style={styles.footer}>
                <Text style={styles.error}>
                    {errorMessage ?? ""}
                </Text>

                {maxLength !== undefined && (
                    <Text
                        style={[
                            styles.counter,
                            {
                                color: length < minLength
                                    ? palette.defaultColor
                                    : palette.labelSecondaryColor,
                            },
                        ]}
                    >
                        {length}/{maxLength}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 20,
    },

    input: {
        width: "100%",
        minHeight: 48,
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 18,
        borderWidth: 1.5,
        fontSize: 16,
        fontWeight: "500",
    },

    footer: {
        minHeight: 22,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 5,
        paddingHorizontal: 4,
    },

    error: {
        flex: 1,
        color: colors.error,
        fontSize: 13,
        fontWeight: "500",
    },

    counter: {
        fontSize: 12,
        fontWeight: "600",
    },
});