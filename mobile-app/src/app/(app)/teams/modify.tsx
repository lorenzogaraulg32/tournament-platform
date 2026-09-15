import {useEffect, useState} from "react";
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {TeamDetails} from "@/src/services/teams/teamService";
import {authenticatedFetch} from "@/src/services/fetchService";
import {normalizeApiRequestError} from "@/src/services/errorService";
import ModifyTeamForm from "@/src/components/pagesComponents/teams/modify/ModifyTeamForm";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type LoadState =
    | {status: "loading"; teamId: string}
    | {status: "success"; teamId: string; team: TeamDetails}
    | {status: "error"; teamId: string; message: string};

export default function ModifyTeamPage() {
    const params = useLocalSearchParams<{teamId?: string | string[]}>();
    const teamId = (Array.isArray(params.teamId)
        ? params.teamId[0]
        : params.teamId)?.trim() ?? "";

    const [state, setState] = useState<LoadState>({status: "loading", teamId});
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let isActive = true;

        async function loadTeam() {
            if (!teamId) {
                setState({status: "error", teamId, message: "ID della squadra mancante."});
                return;
            }

            setState({status: "loading", teamId});

            try {
                const response = await authenticatedFetch(
                    `${API_URL}/teams/${encodeURIComponent(teamId)}`,
                    {method: "GET", headers: {Accept: "application/json"}},
                );
                const team: TeamDetails = await response.json();

                if (!team || String(team.id) !== teamId) {
                    throw new Error("Risposta della squadra non valida.");
                }

                if (isActive) {
                    setState({status: "success", teamId, team});
                }
            } catch (error) {
                if (!isActive) {
                    return;
                }

                const apiError = normalizeApiRequestError(error);

                // Il fetch autenticato gestisce il redirect al login.
                if (apiError.status === 401) {
                    return;
                }

                setState({
                    status: "error",
                    teamId,
                    message: apiError.message || "Impossibile caricare la squadra.",
                });
            }
        }

        void loadTeam();

        return () => {
            isActive = false;
        };
    }, [teamId, retryCount]);

    // Non mostrare i dati della route precedente mentre cambia l'ID.
    if (state.teamId !== teamId || state.status === "loading") {
        return (
            <SafeAreaView style={styles.screen}>
                <ActivityIndicator size="large" color="#00A859" />
                <Text style={styles.message}>Caricamento squadra…</Text>
            </SafeAreaView>
        );
    }

    if (state.status === "error") {
        return (
            <SafeAreaView style={styles.screen}>
                <Text style={styles.title}>Impossibile aprire la modifica</Text>
                <Text style={styles.message}>{state.message}</Text>

                <View style={styles.actions}>
                    {teamId !== "" && (
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => setRetryCount((previous) => previous + 1)}
                            style={({pressed}) => [styles.button, pressed && styles.pressed]}
                        >
                            <Text style={styles.buttonText}>Riprova</Text>
                        </Pressable>
                    )}

                    {router.canGoBack() && (
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => router.back()}
                            style={({pressed}) => [styles.button, styles.secondary, pressed && styles.pressed]}
                        >
                            <Text style={styles.buttonText}>Indietro</Text>
                        </Pressable>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    // Lo stato del form viene inizializzato solo dopo il caricamento.
    return <ModifyTeamForm key={teamId} team={state.team} />;
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        gap: 16,
    },
    title: {fontSize: 20, fontWeight: "700", color: "#16352A", textAlign: "center"},
    message: {fontSize: 15, color: "#444444", textAlign: "center"},
    actions: {flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12},
    button: {backgroundColor: "#008F4E", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12},
    secondary: {backgroundColor: "#52635B"},
    buttonText: {color: "#FFFFFF", fontWeight: "600", fontSize: 15},
    pressed: {opacity: 0.75},
});
