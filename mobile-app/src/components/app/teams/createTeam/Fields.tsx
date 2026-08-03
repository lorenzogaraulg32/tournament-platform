import {StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useState} from "react";

type CreateTeamFieldProps = TextInputProps & {
    label: string;
    optional?: boolean,
    errorMessage?: string;
    labelIconName?: keyof typeof Ionicons.glyphMap;
    inputStyle?: StyleProp<TextStyle>;
    minLength?: number;
    maxLength?: number;
};


export default function Fields({
                                   label,
                                   optional = false,
                                   errorMessage,
                                   labelIconName = "shield-outline",
                                   inputStyle,
                                   minLength,
                                   maxLength,
                                   value,
                                   ...props
                               }: CreateTeamFieldProps) {

    const [isFocused, setIsFocused] = useState(false);
    const isError = Boolean(errorMessage);

    return (
        <View style={styles.container}>

            <View style={styles.externalLabelContainer}>

                <View style={styles.labelContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={labelIconName}
                            size={22}
                            color="#C8480A"
                        />
                    </View>

                    <Text style={styles.fieldLabel}>
                        {label}
                    </Text>
                </View>
                {optional && (
                    <Text style={styles.optionalText}>
                        Opzionale
                    </Text>

                )}
            </View>

            <TextInput
                placeholderTextColor="#929292"
                selectionColor="#C8480A"

                value={value}

                onFocus={(event) => {
                    setIsFocused(true);
                }}

                onBlur={(event) => {
                    setIsFocused(false);
                }}

                maxLength={maxLength}
                style={[
                    styles.fieldInput,
                    isFocused && styles.fieldInputFocused,
                    Boolean(errorMessage) && styles.fieldInputError,
                    inputStyle,
                ]}

                {...props}
            />

            <View style={styles.fieldFooter}>
                <View style={styles.errorContainer}>
                    {errorMessage && (
                        <Text style={styles.errorText}>
                            {errorMessage}
                        </Text>
                    )}
                </View>

                {maxLength !== undefined && (
                    <Text
                        style={[
                            styles.characterCounter,
                            typeof value === "string" &&
                            value.length < (minLength ?? 0) &&
                            styles.characterCounterInvalid,
                        ]}
                    >
                        {typeof value === "string" ? value.length : 0}
                        /{maxLength}
                    </Text>
                )}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 20,
    },

    externalLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 9,

    },

    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    iconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 20,
        backgroundColor: "rgba(200, 72, 10, 0.12)",
    },

    fieldLabel: {
        color: "#1C1C1C",
        fontSize: 17,
        fontWeight: "800",
    },

    fieldInput: {
        width: "100%",
        minHeight: 48,

        paddingHorizontal: 18,
        paddingVertical: 14,

        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: "#D8D8D8",

        backgroundColor: "#F5F5F5",

        color: "#1C1C1C",
        fontSize: 16,
        fontWeight: "500",
    },

    fieldInputFocused: {
        borderColor: "#C8480A",
        backgroundColor: "#FFFFFF",

        shadowColor: "#C8480A",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 1,
    },

    fieldInputError: {
        borderColor: "#B42318",
        backgroundColor: "#FFF7F6",
    },

    optionalText: {
        color: "#a8a8a8",
    },


    fieldFooter: {
        minHeight: 22,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
        paddingHorizontal: 4,
    },

    errorContainer: {
        flex: 1,
    },

    characterCounter: {
        color: "#929292",
        fontSize: 12,
        fontWeight: "600",
    },

    characterCounterInvalid: {
        color: "#C8480A",
    },

    errorText: {
        marginTop: 6,
        marginLeft: 4,
        color: "#B42318",
        fontSize: 13,
        fontWeight: "500",
    },
});