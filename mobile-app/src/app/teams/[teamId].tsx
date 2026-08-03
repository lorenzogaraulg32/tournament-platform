import Background from "@/src/components/common/Background";
import {useEffect, useState} from "react";
import {getTeamDetails} from "@/src/services/teams/teamGetService";
import {ScrollView, StyleSheet, View} from "react-native";
import TitleApp from "@/src/components/app/TitleHeader";
import {router, useLocalSearchParams} from "expo-router";
import TeamInfoSection, {TeamDetails} from "@/src/components/app/teams/TeamInfoSection";

export default function teamId() {

    const {teamId} = useLocalSearchParams<{ teamId: string }>();

    const [currentTeam, setCurrentTeam] = useState<TeamDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function handlePlayersPress() {
        router.push({
            pathname: "/teams/[teamId]/members",
            params: {
                teamId,
                section: "players",
            },
        });
    }

    function handleAdminsPress() {
        router.push({
            pathname: "/teams/[teamId]/members",
            params: {
                teamId,
                section: "admins",
            },
        });
    }


    async function loadTeamInfo() {
        try {
            setIsLoading(true)
            setError(null)
            const loadedTeam = await getTeamDetails(teamId);
            setCurrentTeam(loadedTeam);

        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "Errore durante il recupero della squadra"
                );
            }
        } finally {

            setIsLoading(false);

        }


    }


    useEffect(() => {
        loadTeamInfo()
    }, [teamId]);


    return (
        <Background header={
            <TitleApp
                text={"Dettaglio Squadra"}
                backBtn={true}
            />
        }>
            <View>
                <ScrollView>
                    <TeamInfoSection
                        team={currentTeam}
                        isLoading={isLoading}
                        error={error}
                        onAdminsPress={handleAdminsPress}
                        onPlayersPress={handlePlayersPress}/>
                </ScrollView>
            </View>

        </Background>
    );
}


const styles = StyleSheet.create({});