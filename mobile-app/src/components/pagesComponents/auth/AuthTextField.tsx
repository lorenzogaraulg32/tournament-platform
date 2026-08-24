import {StyleSheet, Text, TextInput, TextInputProps, View} from "react-native";
import {colors} from "@/src/constants/theme";
import {useState} from "react";


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
                                          ...props
                                      }: AuthTextFieldProps) {

    const [isFocus, setFocus] = useState(false);

    const isError = Boolean(errorMessage);

    return (
        <View style={[styles.fieldsContainer]}>

            <Text style={styles.label}>{label}</Text>

            <TextInput
                placeholderTextColor={"rgba(255,255,255,0.50)"}
                selectionColor={colors.orangeDefault}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                style={[
                    styles.fieldInput,
                    isFocus && styles.fieldInputFocused,
                    isError && styles.fieldInputError,
                    style
                ]}
                {...props}
            />

            {errorMessage ? (
                <Text style={styles.errorLabel}>{errorMessage}</Text>
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
        backgroundColor:  "rgba(255,255,255,0.30)",
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.35)",
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "500",
    },

    fieldInputFocused: {
        borderColor: colors.orangeDefault,
        backgroundColor: "rgba(255,255,255,0.40)",
    },

    fieldInputError: {
        borderColor: colors.error,
    },
})