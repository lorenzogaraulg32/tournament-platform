import {useState} from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {paletteVariants} from "@/src/constants/palette/PaletteManager";
import {colors} from "@/src/constants/theme";
import FormLabel from "@/src/components/common/labels/FormLabel";

type ProfilePasswordFieldProps = Omit<TextInputProps, "secureTextEntry"> & {
    label: string;
    errorMessage?: string;
};

export default function ProfilePasswordField({
    label,
    errorMessage,
    style,
    onFocus,
    onBlur,
    ...props
}: ProfilePasswordFieldProps) {
    const {palette} = paletteVariants["profile"];
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    return (
        <View style={styles.fieldsContainer}>
            <FormLabel
                text={label}
                variant={"profile"}
                optional={false}
                labelIconName={"lock-closed"}
            />


            <View style={styles.inputContainer}>
                <TextInput
                    {...props}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!isPasswordVisible}
                    placeholderTextColor={palette.labelSecondaryColor}
                    selectionColor={palette.defaultColor}
                    onFocus={(event) => {
                        setIsFocused(true);
                        onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        setIsFocused(false);
                        onBlur?.(event);
                    }}
                    style={[
                        styles.fieldInput,
                        {
                            color: palette.labelColor,
                            backgroundColor: palette.defaultColorBK,
                            borderColor: errorMessage
                                ? colors.error
                                : isFocused
                                    ? palette.defaultColor
                                    : palette.borderColor,
                        },
                        style,
                    ]}
                />

                <Pressable
                    style={styles.passwordToggle}
                    onPress={() => setPasswordVisible((previous) => !previous)}
                    accessibilityRole="button"
                    accessibilityLabel={
                        isPasswordVisible ? "Nascondi password" : "Mostra password"
                    }
                    hitSlop={10}
                >
                    <Ionicons
                        name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                        size={22}
                        color={palette.labelSecondaryColor}
                    />
                </Pressable>
            </View>

            {!!errorMessage && (
                <Text style={styles.errorLabel}>{errorMessage}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    fieldsContainer: {
        width: "100%",
        marginBottom: 22,
    },
    label: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "800",
        marginLeft: 10,
        marginBottom: 8,
    },
    inputContainer: {
        position: "relative",
        width: "100%",
    },
    fieldInput: {
        width: "100%",
        height: 48,
        borderRadius: 18,
        borderWidth: 1.5,
        paddingLeft: 18,
        paddingRight: 52,
        fontSize: 17,
        fontWeight: "500",
    },
    passwordToggle: {
        position: "absolute",
        right: 18,
        top: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    errorLabel: {
        marginTop: 6,
        marginLeft: 10,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: "500",
        color: colors.error,
    },
});
