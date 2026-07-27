import {StyleSheet, TextInput, TextInputProps, View} from "react-native";
import {colors} from "@/src/constants/theme";

import AuthText from "@/src/components/auth/AuthText";
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

            <AuthText variant="fieldLabel" text={label}/>

            <TextInput
                placeholderTextColor={colors.inputPlaceholder}
                selectionColor={colors.contrastColor}
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
                <AuthText
                    variant="errorLabelInput"
                    text={errorMessage}
                />
            ) : null}
        </View>
    );
}


const styles = StyleSheet.create({
    fieldsContainer: {
        width: "100%",
        marginBottom: 22,
    },


    fieldInput: {
        width: "100%",
        height: 58,
        borderRadius: 18,
        paddingHorizontal: 18,
        backgroundColor: colors.inputBackground,
        borderWidth: 1.5,
        borderColor: colors.inputBorder,
        color: colors.textPrimary,
        fontSize: 17,
        fontWeight: "500",
    },

    fieldInputFocused: {
        borderColor: colors.contrastColor,
        backgroundColor: colors.inputBackgroundFocused,
    },

    fieldInputError: {
        borderColor: colors.error,
    },
})