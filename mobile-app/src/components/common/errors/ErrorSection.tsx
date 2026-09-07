import {Pressable, StyleSheet, Text, View} from "react-native";
import {corners} from "@/src/constants/theme";


type ErrorSectionProps = {
    text: string
    onRetry?: () => void
    variant: "error" | "warning"
}


export default function ErrorSection({text, onRetry, variant}: ErrorSectionProps) {
    return (
        <View style={styles.errorContainer}>
            <Text style={[
                variant == "error" && styles.errorText,
                variant == "warning" && styles.warningText]
            }>
                {text}
            </Text>
            {onRetry && <Pressable
                style={styles.retryBtn}
                onPress={onRetry}
            >
                <Text style={styles.retryBtnText}>Riprova</Text>
            </Pressable>}
        </View>
    );
}


const styles = StyleSheet.create({
    errorContainer: {
        minHeight: 64,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingHorizontal: 20,
    },

    errorText: {
        fontSize: 14,
        color: "#B42318",
        textAlign: "center",
    },

    warningText: {
        fontSize: 14,
        color: "#666666",
        textAlign: "center",
    },

    retryBtn: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: corners.standard,
        backgroundColor: "#B42318",
        shadowColor: "#7A1710",
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 3,
        },

        shadowRadius: 5,
        elevation: 4,
    },

    retryBtnText: {
        fontWeight: 600,
        color: "#ffffff"
    },
})