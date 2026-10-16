import {StyleSheet, View} from "react-native";
import TeamCardHorizontal from "@/src/components/common/cards/teamCards/TeamCardHorizontal";
import {useCallback, useRef, useState} from "react";
import {router, useFocusEffect} from "expo-router";
import {normalizeApiRequestError} from "@/src/services/errorService";
import ButtonBackground from "@/src/components/common/buttons/ButtonBackground";
import LoadingSection from "@/src/components/common/loading/LoadingSection";
import ErrorSection from "@/src/components/common/errors/ErrorSection";
import {TeamDetails} from "@/src/services/teams/teamDTO";
import {fetchUserTeams} from "@/src/services/teams/teamService";
import {loadCurrentUserId} from "@/src/services/users/authService";
import StandardCardList from "@/src/components/common/layout/StandardCardList";


/**
 * Sezione che rappresenta i team a cui un utente partecipa
 */
export default function MyTeams() {

    //states
    const [userTeams, setUserTeams] = useState<TeamDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const requestIdRef = useRef(0);

    const loadUserTeams = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        try {
            setIsLoading(true);
            setError(null);

            const currentUserId = await loadCurrentUserId();

            if (currentUserId === null) {
                router.replace("/(auth)");
                return null;
            }


            const loadedTeams = await fetchUserTeams(currentUserId);

            if (requestId === requestIdRef.current) {
                setUserTeams(loadedTeams);
            }
        } catch (error) {
            if (requestId !== requestIdRef.current) {
                return;
            }

            const apiError = normalizeApiRequestError(error);

            // Redirect già gestito da authenticatedFetch

            setError(apiError.message);
        } finally {
            if (requestId === requestIdRef.current) {
                setIsLoading(false);
            }
        }
    }, []);


    useFocusEffect(
        useCallback(() => {
            void loadUserTeams();

            return () => {
                requestIdRef.current++;
            };
        }, [loadUserTeams])
    );


    return (
        <View style={styles.myTeamsContent}>

            {isLoading ? (
                <LoadingSection text="Caricamento squadre..."/>
            ) : error ? (
                <ErrorSection
                    text={error}
                    onRetry={loadUserTeams}
                    variant="error"
                />
            ) : userTeams.length === 0 ? (
                <ErrorSection
                    text="Entra in una squadra con il codice invito"
                    variant="warning"
                />
            ) : (
                <StandardCardList
                    style={styles.scroll}
                    items={userTeams.map(team => (
                        <TeamCardHorizontal
                            key={team.id}
                            teamDetails={team}
                        />
                    ))}
                    emptyMsg="Nessuna squadra"
                    orientation={"vertical"}
                />
            )}

            <ButtonBackground
                text="Crea nuova squadra"
                onPress={() => router.push("/teams/create")}
                variant="orange"
            />

        </View>
    );
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


});