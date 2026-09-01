import {colors} from "@/src/constants/theme";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {ActivityIndicator, Pressable, StyleSheet, Text, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {clearSession} from "@/src/services/users/sessionService";
import {router} from "expo-router";

type ErrorScreenProps = {
    title?: string;
    message?: string;
    onRetry?: () => void | Promise<void>;
    isRetrying?: boolean;
    retryText?: string;
};

const DEFAULT_TITLE = "Impossibile caricare la risorsa";

const DEFAULT_MESSAGE =
    "Si è verificato un problema durante il caricamento. Controlla la connessione e riprova.";

export default function ErrorScreen({
                                        title = DEFAULT_TITLE,
                                        message,
                                        onRetry,
                                        isRetrying = false,
                                        retryText = "Riprova",
                                    }: ErrorScreenProps) {
    const displayedMessage =
        message?.trim() || DEFAULT_MESSAGE;

    function handleRetry() {
        void onRetry?.();
    }

    async function handleBackToLogin() {
        await clearSession();
        router.replace("/(auth)");
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
                    {title}
                </Text>

                <Text style={styles.message}>
                    {displayedMessage}
                </Text>

                {onRetry && (
                    <Pressable
                        style={({pressed}) => [
                            styles.retryButton,
                            pressed &&
                            !isRetrying &&
                            styles.retryButtonPressed,
                            isRetrying &&
                            styles.retryButtonDisabled,
                        ]}
                        onPress={handleRetry}
                        disabled={isRetrying}
                        accessibilityRole="button"
                        accessibilityLabel={retryText}
                        accessibilityState={{
                            disabled: isRetrying,
                        }}
                    >
                        {isRetrying ? (
                            <ActivityIndicator
                                size="small"
                                color="#ffffff"
                            />
                        ) : (
                            <>
                                <Ionicons
                                    name="refresh"
                                    size={18}
                                    color="#ffffff"
                                />

                                <Text style={styles.retryButtonText}>
                                    {retryText}
                                </Text>
                            </>
                        )}
                    </Pressable>
                )}
                <Pressable
                    style={({pressed}) => [
                        styles.secondaryButton,
                        pressed && styles.retryButtonPressed,
                    ]}
                    onPress={handleBackToLogin}
                    disabled={isRetrying}
                    accessibilityRole="button"
                    accessibilityLabel={"Esci"}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={18}
                        color={colors.background}
                    />

                    <Text style={styles.secondaryButtonText}>
                        Esci
                    </Text>
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

    secondaryButton: {
        minWidth: 150,
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        marginTop: 12,
        paddingHorizontal: 24,
        paddingVertical: 13,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.background,
        backgroundColor: "#ffffff",
    },

    secondaryButtonText: {
        color: colors.background,
        fontSize: 16,
        fontWeight: "800",
    },
});
