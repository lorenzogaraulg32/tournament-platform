import {ScrollView, StyleSheet, View} from "react-native";
import {useCallback, useRef, useState} from "react";
import {router, useFocusEffect} from "expo-router";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {TournamentDetails} from "@/src/services/tournaments/tournamentDTO";
import LoadingSection from "@/src/components/common/loading/LoadingSection";
import ErrorSection from "@/src/components/common/errors/ErrorSection";
import {MyTournamentsSection} from "@/src/components/pagesComponents/tournaments/MyTournamentsSection";
import {fetchUserTeams} from "@/src/services/teams/teamService";
import {loadCurrentUserId} from "@/src/services/users/authService";
import {fetchUserTournaments} from "@/src/services/tournaments/tournamentService";
import ActionButton from "@/src/components/common/buttons/ActionButton";
import {FontAwesome6} from "@expo/vector-icons";


/**
 * Sezione che rappresenta i tornei a cui un utente partecipa
 */
export default function MyTournaments() {

    //states
    const [tournamentsAdmin, setTournamentsAdmin] = useState<TournamentDetails[]>([]);
    const [tournamentsPlayer, setTournamentsPlayer] = useState<TournamentDetails[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const requestIdRef = useRef(0);


    const loadUserTournaments = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        try {
            setLoading(true);
            setError(null);

            const currentUserId = await loadCurrentUserId();

            if (currentUserId === null) {
                router.replace("/(auth)");
                return null;
            }

            const loadedTournaments = await fetchUserTournaments(await fetchUserTeams(currentUserId), currentUserId);

            if (requestId !== requestIdRef.current) {
                return;
            }

            setTournamentsAdmin(loadedTournaments.managed);
            setTournamentsPlayer(loadedTournaments.participating);
        } catch (error) {
            if (requestId !== requestIdRef.current) {
                return;
            }

            const apiError = normalizeApiRequestError(error);

            // Redirect già gestito da authenticatedFetch
            if (apiError.status === 401) {
                return;
            }

            setError(apiError.message);
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadUserTournaments();

            return () => {
                requestIdRef.current++;
            };
        }, [loadUserTournaments])
    )

    function renderContent() {
        if (isLoading) {
            return (
                <LoadingSection text="Caricamento tornei..."/>
            );
        }

        if (error) {
            return (
                <ErrorSection
                    text={error}
                    onRetry={() => void loadUserTournaments()}
                    variant="error"
                />
            );
        }

        return (
            <View>
                <MyTournamentsSection
                    title="Tornei che gestisci"
                    subtitle="I tornei di cui sei organizzatore o admin."
                    icon="crown"
                    tournaments={tournamentsAdmin}
                    emptyMessage="Crea un nuovo torneo..."
                />

                <MyTournamentsSection
                    title="Tornei a cui partecipi"
                    subtitle="I tornei a cui ti sei iscritto."
                    icon="users"
                    tournaments={tournamentsPlayer}
                    emptyMessage="Iscriviti tramite codice invito!"
                />
            </View>
        );
    }

    return (
        <View style={styles.myTeamsContent}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator
                persistentScrollbar
            >
                {renderContent()}
            </ScrollView>
            <ActionButton
                label="Crea nuovo torneo"
                onPress={() => router.push("/tournaments/create")}
                paletteVariant={"tournaments"}
                backgroundVariant={
                    {
                        variant: "image",
                        imageSource: require("../../../../assets/images/backgrounds/purpleBackground.png")
                    }}
                iconLeft={
                    <FontAwesome6
                        name="plus"
                        size={19}
                        color="#FFFFFF"
                    />
                }
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

});