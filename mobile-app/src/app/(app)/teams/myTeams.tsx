import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import {getCurrentUserTeams, TeamInfo} from "@/src/services/teams/teamService";
import TeamCardHorizontal from "@/src/components/app/teams/TeamCardHorizontal";
import {useCallback, useState} from "react";
import {useFocusEffect} from "expo-router";


/**
 * Sezione che rappresenta i team a cui un utente partecipa
 */
export default function MyTeams() {

    //states
    const [userTeams, setUserTeams] = useState<TeamInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    async function loadUserTeams(isActive: boolean) {
        console.log("Loading user teams....")
        try {
            setIsLoading(true)
            setError(null)

            const loadedTeams = await getCurrentUserTeams()

            if (isActive) {
                setUserTeams(loadedTeams);
            }


        } catch (error: unknown) {

            if (!isActive) {
                return;
            }

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "Errore durante il recupero delle squadre"
                );
            }
        } finally {
            if (isActive) {
                setIsLoading(false);
            }

        }


    }

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
            console.log("UserTeam vuoto")
            return (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        Non sei iscritto a nessuna squadra
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

    useFocusEffect(
        useCallback(() => {

            let isActive = true;

             void loadUserTeams(isActive)

            return () => {
                isActive = false;
            };

        }, [])
    )


    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator
            persistentScrollbar
        >
            {renderUserTeams()}
        </ScrollView>
    )
}


const styles = StyleSheet.create({

    scroll: {
        flex: 1
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