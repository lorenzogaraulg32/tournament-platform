import React from "react";
import {ActivityIndicator, Image, Pressable, StyleSheet, Text, View,} from "react-native";

type GoogleAuthButtonProps = {
    label?: string
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
};

export default function GoogleAuthButton({
                                             label = "Continua con Google",
                                             onPress,
                                             loading = false,
                                             disabled = false,
                                         }: GoogleAuthButtonProps) {

    const isDisabled = loading || disabled;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{disabled: isDisabled, busy: loading}}
            style={({pressed}) => [
                styles.button,
                pressed && !isDisabled && styles.pressed,
                isDisabled && styles.disabled,
            ]}
        >
            <Image
                source={require(
                    "../../../../assets/Buttons/google-g.png"
                )}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.text}>
                {label}
            </Text>

            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator
                        size="small"
                        color="#1F1F1F"
                    />
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        height: 54,
        backgroundColor: "#FFFFFF",
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#747775",
        justifyContent: "center",
        alignItems: "center",
    },

    pressed: {
        opacity: 0.92,
        transform: [{scale: 0.985}],
    },

    disabled: {
        opacity: 0.65,
    },

    logo: {
        position: "absolute",
        left: 20,
        width: 22,
        height: 22,
    },

    text: {
        color: "#1F1F1F",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
    },

    loader: {
        position: "absolute",
        right: 20,
    },
});
