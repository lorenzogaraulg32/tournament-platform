import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import {getCurrentUserTeams, TeamInfo} from "@/src/services/teams/teamService";
import TeamCardHorizontal from "@/src/components/common/carousel&cards/TeamCardHorizontal";
import {useCallback, useState} from "react";
import {router, useFocusEffect} from "expo-router";
import {normalizeApiRequestError} from "@/src/services/errorService";
import ButtonBackground from "@/src/components/common/buttons/ButtonBackground";


/**
 * Sezione che rappresenta i team a cui un utente partecipa
 */
export default function MyTeams() {

    //states
    const [userTeams, setUserTeams] = useState<TeamInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            async function loadUserTeams() {
                try {
                    setIsLoading(true);
                    setError(null);

                    const loadedTeams = await getCurrentUserTeams();

                    if (isActive) {
                        setUserTeams(loadedTeams);
                    }
                } catch (error) {
                    if (!isActive) {
                        return;
                    }
                    const apiError = normalizeApiRequestError(error)

                    // Redirect già gestito da authenticatedFetch
                    if (apiError.status === 401) {
                        return;
                    }

                    setError(apiError.message)
                } finally {
                    if (isActive) {
                        setIsLoading(false);
                    }
                }
            }

            void loadUserTeams();

            return () => {
                isActive = false;
            };
        }, [])
    );

    function renderUserTeams() {

        if (isLoading) {
            return (
                <View style={styles.messageContainer}>
                    <ActivityIndicator size={"small"}/>
                    <Text style={styles.messageText}>
                        Caricamento squadre...
                    </Text>
                </View>
            )
        }

        if (error) {
            return (
                <View style={styles.messageContainer}>
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                </View>
            )
        }

        if (userTeams.length === 0) {
            return (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        Entra in una squadra con il codice invito
                    </Text>
                </View>
            )
        }


        return userTeams.map((team) => (

            <TeamCardHorizontal
                key={team.id}
                id={team.id}
                name={team.name}
                logoUrl={team.logoUrl ?? undefined}
                playersCount={team.numberOfPlayers}
            />
        ));
    }

    return (
        <View style={styles.myTeamsContent}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator
                persistentScrollbar
            >
                {renderUserTeams()}
            </ScrollView>
            <ButtonBackground
                text="Crea nuova squadra"
                onPress={() => router.push("/teams/create")}
                variant="orange"
            />

        </View>
    )
}


const styles = StyleSheet.create({

    scroll: {
        flex: 1
    },

    myTeamsContent: {
        flex: 1,
        minHeight: 0,
    },

    content: {
        paddingBottom: 6,
        gap: 6,
    },

    messageContainer: {
        minHeight: 64,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingHorizontal: 20,
    },

    messageText: {
        fontSize: 14,
        color: "#666666",
        textAlign: "center",
    },

    errorText: {
        fontSize: 14,
        color: "#B42318",
        textAlign: "center",
    },
});