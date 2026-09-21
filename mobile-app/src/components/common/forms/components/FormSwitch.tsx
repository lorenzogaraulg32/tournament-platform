import {Pressable, StyleSheet, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FormLabel from "@/src/components/common/labels/FormLabel";
import {paletteVariants, type Variant} from "@/src/constants/PaletteManager";

type SwitchProps<T extends string> = {
    variant: Variant;
    label: string;
    value: T;
    options: readonly {
        value: T;
        label: string;
    }[];
    onChange: (value: T) => void;
    optional?: boolean;
    disabled?: boolean;
    infoTitle?: string;
    infoMessage?: string;
    labelIconName?: keyof typeof Ionicons.glyphMap;
};

export default function FormSwitch<T extends string>({
                                                     variant,
                                                     label,
                                                     value,
                                                     options,
                                                     onChange,
                                                     optional = false,
                                                     disabled = false,
                                                     infoTitle,
                                                     infoMessage,
                                                     labelIconName,
                                                 }: SwitchProps<T>) {
    const {palette} = paletteVariants[variant];

    return (
        <View style={styles.container}>
            <FormLabel
                text={label}
                variant={variant}
                optional={optional}
                infoTitle={infoTitle}
                infoMessage={infoMessage}
                labelIconName={labelIconName}
            />

            <View
                style={[
                    styles.optionsContainer,
                    {
                        borderColor: palette.borderColor,
                        backgroundColor: palette.defaultColorBK,
                    },
                    disabled && styles.disabled,
                ]}
            >
                {options.map(option => {
                    const selected = value === option.value;
                    const textColor = selected
                        ? "#FFFFFF"
                        : palette.labelColor;

                    return (
                        <Pressable
                            key={option.value}
                            onPress={() => onChange(option.value)}
                            disabled={disabled}
                            accessibilityRole="radio"
                            accessibilityState={{selected, disabled}}
                            accessibilityLabel={option.label}
                            style={({pressed}) => [
                                styles.option,
                                selected && {
                                    backgroundColor: palette.defaultColor,
                                },
                                pressed && styles.pressed,
                            ]}
                        >
                            {selected && (
                                <Ionicons
                                    name="checkmark"
                                    size={20}
                                    color={textColor}
                                />
                            )}

                            <Text
                                style={[
                                    styles.optionText,
                                    {color: textColor},
                                ]}
                            >
                                {option.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 20,
    },

    optionsContainer: {
        flexDirection: "row",
        borderRadius: 18,
        borderWidth: 1.5,
        padding: 3,
    },

    option: {
        flex: 1,
        minHeight: 38,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 14,
    },

    optionText: {
        flexShrink: 1,
        textAlign: "center",
        fontSize: 15,
        fontWeight: "700",
    },

    pressed: {
        opacity: 0.78,
    },

    disabled: {
        opacity: 0.6,
    },
});