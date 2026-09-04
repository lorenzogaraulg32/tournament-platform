import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import {useCallback, useState} from "react";
import {router, useFocusEffect} from "expo-router";
import {normalizeApiRequestError} from "@/src/services/errorService";
import ButtonBackground from "@/src/components/common/buttons/ButtonBackground";
import {TournamentDetails} from "@/src/services/tournaments/tournamentsDTO";
import {getCurrentUserTournaments} from "@/src/services/tournaments/tournamentsService";
import TeamCardHorizontal from "@/src/components/common/carousel&cards/TeamCardHorizontal";
import {FontAwesome6} from "@expo/vector-icons";


/**
 * Sezione che rappresenta i tornei a cui un utente partecipa
 */
export default function MyTournaments() {

    //states
    const [tournamentsAdmin, setTournamentsAdmin] = useState<TournamentDetails[]>([]);
    const [tournamentsPlayer, setTournamentsPlayer] = useState<TournamentDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            async function loadUserTournaments() {
                try {
                    setIsLoading(true);
                    setError(null);

                    const loadedTournaments = await getCurrentUserTournaments();

                    if (isActive) {
                        setTournamentsAdmin(loadedTournaments.managed);
                        setTournamentsPlayer(loadedTournaments.participating);
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

            void loadUserTournaments();

            return () => {
                isActive = false;
            };
        }, [])
    );

    function renderUserTournaments() {

        if (isLoading) {
            return
        }

        if (error) {
            return
        }

        if (tournamentsPlayer.length === 0) {
            return (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        Iscriviti a un torneo con il codice di invito
                    </Text>
                </View>
            )
        }


    }

    return (
        <View style={styles.myTeamsContent}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator
                persistentScrollbar
            >
                // ci saranno due sezioni, i tornei che l'utente gestisce e quelli a cui partecipa
                {isLoading ? (
                    <View style={styles.messageContainer}>
                        <ActivityIndicator size={"small"}/>
                        <Text style={styles.messageText}>
                            Caricamento tornei...
                        </Text>
                    </View>
                ) :/* error ? (
                    <View style={styles.messageContainer}>
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    </View>
                ) : */(
                    <View>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIcon}>
                                <FontAwesome6
                                    name="crown"
                                    size={18}
                                    color="#8E2DE2"
                                />
                            </View>

                            <View>
                                <Text style={styles.sectionTitle}>
                                    Tornei che gestisci
                                </Text>

                                <Text style={styles.sectionSubtitle}>
                                    I tornei di cui sei organizzatore o admin.
                                </Text>
                            </View>
                        </View>
                        {tournamentsAdmin.length === 0 ? (
                            <View style={styles.messageContainer}>
                                <Text style={styles.messageText}>
                                    Crea un nuovo torneo...
                                </Text>
                            </View>
                        ) : (
                            tournamentsAdmin.map((tournament) => (
                                //todo: da sostituire con la card del torneo ancora da fare
                                <TeamCardHorizontal
                                    key={tournament.id}
                                    id={Number(tournament.id)}
                                    name={tournament.name}
                                    playersCount={0}
                                />
                            ))
                        )
                        }
                        <View>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionIcon}>
                                    <FontAwesome6
                                        name="users"
                                        size={18}
                                        color="#8E2DE2"
                                    />
                                </View>

                                <View>
                                    <Text style={styles.sectionTitle}>
                                        Tornei a cui partecipi
                                    </Text>

                                    <Text style={styles.sectionSubtitle}>
                                        I tornei a cui ti sei iscritto.
                                    </Text>
                                </View>
                            </View>
                            {tournamentsPlayer.length === 0 ? (
                                <View style={styles.messageContainer}>
                                    <Text style={styles.messageText}>
                                        Iscriviti tramite codice invito!
                                    </Text>
                                </View>
                            ) : (
                                tournamentsAdmin.map((tournament) => (
                                    //todo: da sostituire con la card del torneo ancora da fare
                                    <TeamCardHorizontal
                                        key={tournament.id}
                                        id={Number(tournament.id)}
                                        name={tournament.name}
                                        playersCount={0}
                                    />
                                ))
                            )
                            }

                        </View>
                    </View>

                )
                }


            </ScrollView>
            <ButtonBackground
                text="Crea nuova squadra"
                onPress={() => router.push("/teams/create")}
                variant="purple"
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
        paddingHorizontal: 5
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


    sectionHeader: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    sectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 22,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#F4E9FF",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#171B2E",
    },

    sectionSubtitle: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: "400",
        color: "#8A8A8A",
    },
});