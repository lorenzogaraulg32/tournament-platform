import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View
} from "react-native";
import {colors} from "@/src/constants/theme";
import {useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";


type AuthTextFieldProps = TextInputProps & {
    label: string;
    errorMessage?: string;
};


export default function AuthTextField({
                                          label,
                                          errorMessage,
                                          style,
                                          onFocus,
                                          onBlur,
                                          secureTextEntry,
                                          ...props
                                      }: AuthTextFieldProps) {

    const [isFocus, setFocus] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const isError = Boolean(errorMessage);
    const isPasswordField = Boolean(secureTextEntry);

    return (
        <View style={styles.fieldsContainer}>

            <Text style={styles.label}>{label}</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholderTextColor="rgba(255,255,255,0.50)"
                    selectionColor={colors.orangeDefault}
                    onFocus={(event) => {
                        setFocus(true);
                        onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        setFocus(false);
                        onBlur?.(event);
                    }}
                    secureTextEntry={
                        isPasswordField && !isPasswordVisible
                    }
                    style={[
                        styles.fieldInput,
                        isPasswordField && styles.passwordInput,
                        isFocus && styles.fieldInputFocused,
                        isError && styles.fieldInputError,
                        style,
                    ]}
                    {...props}
                />

                {isPasswordField && (
                    <Pressable
                        style={styles.passwordToggle}
                        onPress={() =>
                            setPasswordVisible((previous) => !previous)
                        }
                        hitSlop={10}
                    >
                        <Ionicons
                            name={
                                isPasswordVisible
                                    ? "eye-off-outline"
                                    : "eye-outline"
                            }
                            size={22}
                            color="rgba(255,255,255,0.75)"
                        />
                    </Pressable>
                )}
            </View>

            {errorMessage ? (
                <Text style={styles.errorLabel}>
                    {errorMessage}
                </Text>
            ) : null}

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
        fontWeight: 800,
        color: "#ffffff",
        marginLeft: 10,
        marginBottom: 8,
        textAlign: "left"
    },

    inputContainer: {
        position: "relative",
        width: "100%",
    },

    errorLabel: {
        marginTop: 6,
        marginLeft: 10,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: 500,
        color: colors.error,
        textAlign: "left",
    },

    fieldInput: {
        width: "100%",
        height: 58,
        borderRadius: 18,
        paddingHorizontal: 18,
        backgroundColor: "rgba(255,255,255,0.30)",
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.35)",
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "500",
    },

    passwordInput: {
        paddingRight: 52,
    },

    passwordToggle: {
        position: "absolute",
        right: 18,
        top: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },

    fieldInputFocused: {
        borderColor: colors.orangeDefault,
        backgroundColor: "rgba(255,255,255,0.40)",
    },

    fieldInputError: {
        borderColor: colors.error,
    },
});