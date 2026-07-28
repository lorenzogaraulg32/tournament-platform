import Background from "@/src/components/common/Background";
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import SectionBadge from "@/src/components/common/SectionBadge";
import {useEffect, useState} from "react";
import {getUserTeams, TeamInfo} from "@/src/services/teamService";
import TeamCardSmall from "@/src/components/app/teams/TeamCardSmall";
import TitleApp from "@/src/components/app/TitleHeader";

/*
* 1) Fetch team dell'utente
* 2) fetch teams in ricerca max 20
* Per ogni team voglio: Nome, logo, numero partecipanti, id
* */

export default function TeamsPage() {

    let componentIsMounted = true;

    const [userTeams, setUserTeams] = useState<TeamInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    async function loadUserTeams() {
        try {
            setIsLoading(true)
            setError(null)

            const loadedTeams = await getUserTeams()

            if (componentIsMounted) {
                setUserTeams(loadedTeams);
            }

        } catch (error: unknown) {
            if (!componentIsMounted) {
                return;
            }
            setUserTeams([]);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "Errore durante il recupero delle squadre"
                );
            }
        } finally {
            if (componentIsMounted) {
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
            return (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        Non sei iscritto a nessuna squadra
                    </Text>
                </View>
            )
        }


        return userTeams.map((team) => (
            <TeamCardSmall
                key={team.id}
                id={team.id}
                name={team.name}
                logoUrl={team.logoUrl ?? undefined}
                playersCount={team.numberOfPlayers}
            />
        ));
    }

    useEffect(() => {

        componentIsMounted = true;

        loadUserTeams()

        return () => {
            componentIsMounted = false;
        };

    }, []);


    return (
        <Background
            header={
            <TitleApp text={"Squadre"}/>
        }>

            <View style={styles.sectionShadow}>
                <View style={styles.sectionContainer}>
                    <SectionBadge title={"Le Mie Squadre"}/>
                    <ScrollView style={styles.yourTeamsScroll}
                                contentContainerStyle={styles.yourTeamsContent}
                                showsVerticalScrollIndicator={true}
                                persistentScrollbar={true}>
                        {renderUserTeams()}
                    </ScrollView>
                </View>
            </View>
        </Background>
    );
}


const styles = StyleSheet.create({

    sectionShadow: {
        width: "100%",
        borderRadius: 16,

        // Ombra iOS
        shadowColor: "#0B1F17",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.12,
        shadowRadius: 10,

        // Ombra Android
        elevation: 5,
    },

    sectionContainer: {
        backgroundColor: "#FAFAF7",

        borderRadius: 16,
        overflow: "hidden",

        borderWidth: 1,
        borderColor: "rgba(18, 55, 42, 0.14)",

        borderTopWidth: 0,

        paddingBottom: 12,
    },

    yourTeamsScroll: {
        minHeight: 76,
        maxHeight: 192,
        flexGrow: 0,
        overflow: "hidden",
    },

    yourTeamsContent: {
        paddingHorizontal: 2,
        paddingTop: 6,
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