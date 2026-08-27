import {colors} from "@/src/constants/theme";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {ActivityIndicator, Pressable, StyleSheet, Text, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

type ProfileCheckErrorScreenProps = {
    onRetry: () => void | Promise<void>;
    isRetrying?: boolean;
};

export default function ProfileCheckErrorScreen({
                                                    onRetry,
                                                    isRetrying = false,
                                                }: ProfileCheckErrorScreenProps) {
    function handleRetry() {
        void onRetry();
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View
                style={styles.card}
                accessibilityLiveRegion="assertive"
            >
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={38}
                        color={colors.error}
                    />
                </View>

                <Text style={styles.title}>
                    Impossibile verificare il profilo
                </Text>

                <Text style={styles.message}>
                    Si è verificato un problema temporaneo durante il
                    caricamento. Controlla la connessione e riprova.
                </Text>

                <Pressable
                    style={({pressed}) => [
                        styles.retryButton,
                        pressed && !isRetrying && styles.retryButtonPressed,
                        isRetrying && styles.retryButtonDisabled,
                    ]}
                    onPress={handleRetry}
                    disabled={isRetrying}
                    accessibilityRole="button"
                    accessibilityLabel="Riprova a verificare il profilo"
                    accessibilityState={{disabled: isRetrying}}
                >
                    {isRetrying ? (
                        <ActivityIndicator
                            size="small"
                            color={"#ffffff"}
                        />
                    ) : (
                        <>
                            <Ionicons
                                name="refresh"
                                size={18}
                                color={"#ffffff"}
                            />

                            <Text style={styles.retryButtonText}>
                                Riprova
                            </Text>
                        </>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        backgroundColor: colors.background,
    },

    card: {
        width: "100%",
        maxWidth: 420,
        alignItems: "center",
        paddingHorizontal: 28,
        paddingVertical: 36,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.textThird,
        backgroundColor: "#ffffff",
        shadowColor: colors.background,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.18,
        shadowRadius: 14,
        elevation: 7,
    },

    iconContainer: {
        width: 72,
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        borderRadius: 36,
        backgroundColor: colors.orangeDefaultBK,
    },

    title: {
        color: colors.textFourth,
        fontSize: 22,
        fontWeight: "800",
        lineHeight: 28,
        textAlign: "center",
    },

    message: {
        marginTop: 12,
        color: colors.labelInfo,
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
    },

    retryButton: {
        minWidth: 150,
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        marginTop: 28,
        paddingHorizontal: 24,
        paddingVertical: 13,
        borderRadius: 16,
        backgroundColor: colors.background,
    },

    retryButtonPressed: {
        opacity: 0.82,
        transform: [{scale: 0.98}],
    },

    retryButtonDisabled: {
        opacity: 0.65,
    },

    retryButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "800",
    },
});
