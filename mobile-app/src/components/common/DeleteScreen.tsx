import {useCallback, useRef, useState} from "react";
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router, useFocusEffect} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {normalizeApiRequestError} from "@/src/services/errorService";

type DeleteScreenProps = {
    message: string;
    // Il callback deve rilanciare gli errori e può gestire la navigazione al successo.
    onDelete: () => void | Promise<void>;
};

const WAIT_SECONDS = 10;

export default function DeleteScreen({message, onDelete}: DeleteScreenProps) {
    const [secondsLeft, setSecondsLeft] = useState(WAIT_SECONDS);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const unlockAt = useRef(Number.POSITIVE_INFINITY);
    const deletionLock = useRef(false);
    const focusSession = useRef(0);

    useFocusEffect(useCallback(() => {
        const session = ++focusSession.current;
        unlockAt.current = Date.now() + WAIT_SECONDS * 1000;
        setSecondsLeft(WAIT_SECONDS);
        setError(null);

        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((unlockAt.current - Date.now()) / 1000));
            setSecondsLeft(remaining);
            if (remaining === 0) clearInterval(interval);
        }, 250);

        return () => {
            clearInterval(interval);
            if (focusSession.current === session) ++focusSession.current;
        };
    }, []));

    async function handleDelete() {
        if (Date.now() < unlockAt.current || deletionLock.current || isCompleted) return;

        deletionLock.current = true;
        setIsDeleting(true);
        setError(null);
        const session = focusSession.current;

        try {
            await onDelete();
            if (focusSession.current === session) setIsCompleted(true);
        } catch (cause) {
            if (focusSession.current !== session) return;
            const apiError = normalizeApiRequestError(cause);
            if (apiError.status !== 401) {
                setError(apiError.message || "C'è stato un errore. Riprova.");
            }
        } finally {
            deletionLock.current = false;
            // Il componente può restare montato nello stack anche quando perde il focus.
            setIsDeleting(false);
        }
    }

    function handleBack() {
        if (router.canGoBack()) router.back();
        else router.replace("/(app)/teams");
    }

    const isDisabled = secondsLeft > 0 || isDeleting || isCompleted;

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.header}>
                <Pressable
                    onPress={handleBack}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Torna indietro"
                    style={({pressed}) => [styles.backButton, pressed && styles.pressed]}
                >
                    <Ionicons name="chevron-back" size={23} color="#662096" />
                </Pressable>
                <Text style={styles.headerTitle}>Gestione squadra</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.panel}>
                    <View style={styles.symbol}>
                        <Ionicons name="trash-outline" size={35} color="#B42318" />
                    </View>
                    <Text style={styles.title}>Conferma eliminazione</Text>
                    <View style={styles.messageBox}>
                        <View style={styles.messageAccent} />
                        <Text style={styles.message}>{message}</Text>
                    </View>
                    <View style={styles.waitRow}>
                        <Ionicons
                            name={isCompleted ? "checkmark-circle-outline" : secondsLeft > 0 ? "time-outline" : "checkmark-outline"}
                            size={18}
                            color="#662096"
                        />
                        <Text style={styles.waitText} accessibilityLiveRegion="polite">
                            {isCompleted
                                ? "Eliminazione completata"
                                : secondsLeft > 0
                                    ? `Puoi confermare tra ${secondsLeft} secondi`
                                    : "Puoi confermare l'eliminazione"}
                        </Text>
                    </View>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, {width: `${((WAIT_SECONDS - secondsLeft) / WAIT_SECONDS) * 100}%`}]} />
                    </View>
                </View>

                {error && (
                    <View style={styles.errorBox} accessibilityLiveRegion="polite">
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <Pressable
                    onPress={() => void handleDelete()}
                    disabled={isDisabled}
                    accessibilityRole="button"
                    accessibilityLabel={secondsLeft > 0 ? `Elimina, disponibile tra ${secondsLeft} secondi` : "Elimina"}
                    accessibilityState={{disabled: isDisabled, busy: isDeleting}}
                    style={({pressed}) => [styles.deleteButton, isDisabled && styles.disabledButton, pressed && styles.pressed]}
                >
                    {isDeleting
                        ? <ActivityIndicator color="#FFFFFF" />
                        : <Ionicons name="trash-outline" size={21} color="#FFFFFF" />}
                    <Text style={styles.deleteText}>Elimina</Text>
                    {secondsLeft > 0 && <Text style={styles.countdown}>{secondsLeft}s</Text>}
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {flex: 1, backgroundColor: "#FFFFFF"},
    header: {flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(102,32,150,0.08)"},
    backButton: {width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(102,32,150,0.07)"},
    headerTitle: {fontSize: 16, fontWeight: "700", color: "#662096"},
    content: {flexGrow: 1, justifyContent: "center", padding: 24, gap: 20},
    panel: {backgroundColor: "#FAF7FC", borderWidth: 1, borderColor: "#ECE1F3", borderRadius: 24, padding: 24, alignItems: "center", gap: 20},
    symbol: {width: 76, height: 76, borderRadius: 25, backgroundColor: "#FDECEB", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#F5D3D0"},
    title: {fontSize: 24, fontWeight: "800", color: "#36184B", textAlign: "center"},
    messageBox: {width: "100%", flexDirection: "row", gap: 12},
    messageAccent: {width: 4, borderRadius: 4, backgroundColor: "#C8480A"},
    message: {flex: 1, fontSize: 16, lineHeight: 24, color: "#3F3F46"},
    waitRow: {flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8},
    waitText: {flexShrink: 1, fontSize: 13, lineHeight: 19, color: "#662096", textAlign: "center", fontWeight: "600"},
    progressTrack: {height: 4, width: "100%", backgroundColor: "#E9DDEF", borderRadius: 4, overflow: "hidden"},
    progressFill: {height: "100%", backgroundColor: "#662096", borderRadius: 4},
    deleteButton: {minHeight: 56, borderRadius: 16, backgroundColor: "#B42318", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, gap: 10},
    disabledButton: {backgroundColor: "#BD817D"},
    deleteText: {color: "#FFFFFF", fontSize: 16, fontWeight: "800"},
    countdown: {color: "#FFFFFF", fontSize: 13, fontWeight: "600", backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3},
    pressed: {opacity: 0.75},
    errorBox: {padding: 14, borderRadius: 12, backgroundColor: "#FFF1F0"},
    errorText: {color: "#B42318", fontSize: 14, lineHeight: 20, textAlign: "center"},
});
