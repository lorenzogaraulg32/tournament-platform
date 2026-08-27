import {colors} from "@/src/constants/theme";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {ActivityIndicator, StyleSheet, Text, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

type LoadingScreenProps = {
    message?: string;
};

export default function LoadingScreen({
                                          message = "Stiamo verificando il tuo profilo...",
                                      }: LoadingScreenProps) {
    return (
        <SafeAreaView style={styles.screen}>
            <View
                style={styles.card}
                accessibilityRole="progressbar"
                accessibilityLiveRegion="polite"
                accessibilityLabel={message}
            >
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="football-outline"
                        size={34}
                        color={colors.background}
                    />
                </View>

                <Text style={styles.title}>
                    Prepariamo il tuo spazio
                </Text>

                <Text style={styles.message}>
                    {message}
                </Text>

                <ActivityIndicator
                    style={styles.loader}
                    size="small"
                    color={colors.background}
                />
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
        width: 68,
        height: 68,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        borderRadius: 34,
        backgroundColor: "#F2FBF6",
    },

    title: {
        color: colors.labelForm,
        fontSize: 22,
        fontWeight: "800",
        textAlign: "center",
    },

    message: {
        marginTop: 9,
        color: "#5F7469",
        fontSize: 15,
        lineHeight: 21,
        textAlign: "center",
    },

    loader: {
        marginTop: 24,
    },
});
