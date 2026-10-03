import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import FormLabel from "@/src/components/common/labels/FormLabel";
import {colors} from "@/src/constants/theme";
import {paletteVariants, Variant} from "@/src/constants/PaletteManager";
import {useEffect, useState} from "react";

type FormSpinnerFieldProps = {
    variant: Variant;

    label: string;
    value: number;
    onChange: (value: number) => void;

    min?: number;
    max?: number;
    step?: number;

    errorMessage?: string;
    disabled?: boolean;

    optional?: boolean;
    labelIconName?: keyof typeof Ionicons.glyphMap;
};

export default function FormSpinnerField({
                                             variant,
                                             label,
                                             value,
                                             onChange,
                                             min,
                                             max,
                                             step = 1,
                                             errorMessage,
                                             disabled = false,
                                             optional = false,
                                             labelIconName = "options-outline",
                                         }: FormSpinnerFieldProps) {

    const [inputValue, setInputValue] = useState(String(value));

    useEffect(() => {
        setInputValue(String(value));
    }, [value]);


    const {palette} = paletteVariants[variant];

    const canDecrease =
        !disabled &&
        (min === undefined || value - step >= min);

    const canIncrease =
        !disabled &&
        (max === undefined || value + step <= max);

    function handleDecrease() {
        if (!canDecrease) {
            return;
        }

        onChange(value - step);
    }

    function handleIncrease() {
        if (!canIncrease) {
            return;
        }

        onChange(value + step);
    }

    function handleTextChange(text: string) {
        if (!/^\d*$/.test(text)) {
            return;
        }

        setInputValue(text);
    }

    function handleInput() {
        const parsedValue = Number(inputValue);

        if (
            inputValue === "" ||
            Number.isNaN(parsedValue) ||
            (min !== undefined && parsedValue < min) ||
            (max !== undefined && parsedValue > max)
        ) {
            setInputValue(String(value));
            return;
        }

        onChange(parsedValue);
    }

    return (
        <View style={styles.container}>

            <FormLabel
                text={label}
                variant={variant}
                optional={optional}
                labelIconName={labelIconName}
            />

            <View
                style={[
                    styles.spinnerContainer,
                    {
                        borderColor: errorMessage
                            ? colors.error
                            : palette.borderColor,

                        backgroundColor: errorMessage
                            ? colors.errorBK
                            : palette.defaultColorBK,
                    },
                ]}
            >
                <Pressable
                    onPress={handleDecrease}
                    disabled={!canDecrease}
                    accessibilityRole="button"
                    accessibilityLabel={`Diminuisci ${label}`}
                    style={({pressed}) => [
                        styles.button,
                        pressed && canDecrease && styles.pressed,
                        !canDecrease && styles.disabled,
                    ]}
                >
                    <Ionicons
                        name="remove-outline"
                        size={18}
                        color={
                            canDecrease
                                ? palette.defaultColor
                                : palette.labelSecondaryColor
                        }
                    />
                </Pressable>

                <View style={styles.valueContainer}>
                    <TextInput
                        value={inputValue}
                        onChangeText={handleTextChange}
                        onBlur={handleInput}
                        onSubmitEditing={handleInput}
                        keyboardType="number-pad"
                        inputMode="numeric"
                        editable={!disabled}
                        selectTextOnFocus
                        style={[
                            styles.value,
                            {
                                color: palette.labelColor,
                            },
                        ]}
                    />
                </View>

                <Pressable
                    onPress={handleIncrease}
                    disabled={!canIncrease}
                    accessibilityRole="button"
                    accessibilityLabel={`Aumenta ${label}`}
                    style={({pressed}) => [
                        styles.button,
                        pressed && canIncrease && styles.pressed,
                        !canIncrease && styles.disabled,
                    ]}
                >
                    <Ionicons
                        name="add-outline"
                        size={18}
                        color={
                            canIncrease
                                ? palette.defaultColor
                                : palette.labelSecondaryColor
                        }
                    />
                </Pressable>
            </View>

            {!!errorMessage && (
                <Text style={styles.errorText}>
                    {errorMessage}
                </Text>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 5,
        marginBottom: 30,
    },

    spinnerContainer: {
        height: 40,
        width: "30%",
        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1.5,
        borderRadius: 18,

        overflow: "hidden",
    },

    button: {
        paddingHorizontal : 8,
        alignItems: "center",
        justifyContent: "center",
    },

    valueContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    value: {
        width: "100%",
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        paddingVertical: 0,
    },

    pressed: {
        opacity: 0.6,
    },

    disabled: {
        opacity: 0.35,
    },

    errorText: {
        marginTop: 6,
        marginLeft: 4,

        color: colors.error,
        fontSize: 13,
        fontWeight: "500",
    },
});