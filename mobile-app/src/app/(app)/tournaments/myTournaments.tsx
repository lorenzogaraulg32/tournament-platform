import {ScrollView, StyleSheet, View} from "react-native";
import {useCallback, useRef, useState} from "react";
import {router, useFocusEffect} from "expo-router";
import {normalizeApiRequestError} from "@/src/services/errorService";
import ButtonBackground from "@/src/components/common/buttons/ButtonBackground";
import {TournamentDetails} from "@/src/services/tournaments/tournamentsDTO";
import {getCurrentUserTournaments} from "@/src/services/tournaments/tournamentsService";
import LoadingSection from "@/src/components/common/loading/LoadingSection";
import ErrorSection from "@/src/components/common/errors/ErrorSection";
import {TournamentSection} from "@/src/components/pagesComponents/tournaments/TournamentSection";


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

            const loadedTournaments =
                await getCurrentUserTournaments();

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
                <TournamentSection
                    title="Tornei che gestisci"
                    subtitle="I tornei di cui sei organizzatore o admin."
                    icon="crown"
                    tournaments={tournamentsAdmin}
                    emptyMessage="Crea un nuovo torneo..."
                />

                <TournamentSection
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
            <ButtonBackground
                text="Crea nuovo torneo"
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

});