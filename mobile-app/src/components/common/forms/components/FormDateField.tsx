import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import DateTimePicker, {
    type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";

import FormLabel from "@/src/components/common/labels/FormLabel";
import {colors} from "@/src/constants/theme";
import {paletteVariants, Variant} from "@/src/constants/PaletteManager";
import {formatDateForBackend, parseDateForPicker} from "@/src/constants/helpers/parsingHelper";
import {LocalDateString} from "@/src/services/common";

type FormDateFieldProps = {
    variant: Variant;
    label: string;
    value: LocalDateString | null;
    onChange: (value: LocalDateString) => void;

    placeholder?: string;
    errorMessage?: string;

    minimumDate?: Date;
    maximumDate?: Date;

    disabled?: boolean;
};

export default function FormDateField({
                                          variant,
                                          label,
                                          value,
                                          onChange,
                                          placeholder = "Seleziona una data",
                                          errorMessage,
                                          minimumDate,
                                          maximumDate,
                                          disabled = false,
                                      }: FormDateFieldProps) {

    const [showPicker, setShowPicker] = useState(false);

    const {palette} = paletteVariants[variant];

    function handleDateChange(
        event: DateTimePickerEvent,
        selectedDate?: Date
    ) {
        setShowPicker(false);

        if (event.type === "set" && selectedDate) {
            onChange(formatDateForBackend(selectedDate));
        }
    }

    return (
        <View style={styles.container}>

            <FormLabel
                text={label}
                variant={variant}
                labelIconName="calendar-outline"
            />

            <Pressable
                disabled={disabled}
                onPress={() => setShowPicker(true)}
                style={({pressed}) => [
                    styles.dateField,
                    {
                        borderColor: errorMessage
                            ? colors.error
                            : palette.borderColor,

                        backgroundColor: errorMessage
                            ? colors.errorBK
                            : palette.defaultColorBK,
                    },

                    pressed && !disabled && styles.pressed,
                    disabled && styles.disabled,
                ]}
            >
                <Ionicons
                    name="calendar-outline"
                    size={21}
                    color={
                        value
                            ? palette.defaultColor
                            : palette.labelSecondaryColor
                    }
                />

                <Text
                    style={[
                        styles.dateText,
                        {
                            color: value
                                ? palette.labelColor
                                : palette.labelSecondaryColor,
                        },
                    ]}
                >
                    {value ?? placeholder}
                </Text>

                <Ionicons
                    name="chevron-down-outline"
                    size={18}
                    color={palette.labelSecondaryColor}
                />
            </Pressable>

            {!!errorMessage && (
                <Text style={styles.errorText}>
                    {errorMessage}
                </Text>
            )}

            {showPicker && (
                <DateTimePicker
                    value={parseDateForPicker(value)}
                    mode="date"
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    onChange={handleDateChange}
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 5,
    },

    dateField: {
        minHeight: 54,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,

        paddingHorizontal: 16,

        borderRadius: 18,
        borderWidth: 1.5,
    },

    dateText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
    },

    pressed: {
        opacity: 0.7,
    },

    disabled: {
        opacity: 0.6,
    },

    errorText: {
        marginTop: 6,
        marginLeft: 4,

        color: colors.error,
        fontSize: 13,
        fontWeight: "500",
    },
});