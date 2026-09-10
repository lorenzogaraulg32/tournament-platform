import {ScrollView, StyleSheet, View} from "react-native";
import {getCurrentUserTeams, TeamInfo} from "@/src/services/teams/teamService";
import TeamCardHorizontal from "@/src/components/pagesComponents/teams/cards/TeamCardHorizontal";
import {useCallback, useRef, useState} from "react";
import {router, useFocusEffect} from "expo-router";
import {normalizeApiRequestError} from "@/src/services/errorService";
import ButtonBackground from "@/src/components/common/buttons/ButtonBackground";
import LoadingSection from "@/src/components/common/loading/LoadingSection";
import ErrorSection from "@/src/components/common/errors/ErrorSection";


/**
 * Sezione che rappresenta i team a cui un utente partecipa
 */
export default function MyTeams() {

    //states
    const [userTeams, setUserTeams] = useState<TeamInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const requestIdRef = useRef(0);

    const loadUserTeams = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        try {
            setIsLoading(true);
            setError(null);

            const loadedTeams = await getCurrentUserTeams();

            if (requestId === requestIdRef.current) {
                setUserTeams(loadedTeams);
            }
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


    function renderUserTeams() {

        if (isLoading) {
            return (
                <LoadingSection text={"Caricamento squadre..."}/>
            )
        }

        if (error) {
            return (
                <ErrorSection text={error} onRetry={loadUserTeams} variant={"error"}/>
            )
        }

        if (userTeams.length === 0) {
            return (
                <ErrorSection text={"Entra in una squadra con il codice invito"} variant={"warning"}/>
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


});