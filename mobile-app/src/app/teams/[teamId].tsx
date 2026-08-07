import Background from "@/src/components/common/Background";
import {useEffect, useState} from "react";
import {getTeamDetails, TeamDetails} from "@/src/services/teams/teamGetService";
import {ScrollView, StyleSheet, View} from "react-native";
import TitleApp from "@/src/components/common/headers/HeaderMain";
import {useLocalSearchParams} from "expo-router";
import {loadCurrentUserId} from "@/src/services/userService";
import TeamHeader from "@/src/components/app/teams/TeamHeader";

export default function teamId() {

    const {teamId} = useLocalSearchParams<{ teamId: string }>();
    const [userId, setUserId] = useState<number | null>(null);
    const [currentTeam, setCurrentTeam] = useState<TeamDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const canModifyTeam =
        currentTeam !== null &&
        userId !== null &&
        currentTeam.adminIds.includes(String(userId));


    function handleFriendInvitation() {
        //todo
    }

    function handleModTeam() {
        //todo
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

    async function loadUserId() {
        const id = await loadCurrentUserId();
        setUserId(id);
    }


    useEffect(() => {
        void loadUserId();
        void loadTeamInfo()
    }, [teamId]);


    return (
        <Background
            header={
                <TitleApp
                    text="Dettagli squadra"
                    backBtn
                    optionsBtn={canModifyTeam}
                    onOptionsPress={canModifyTeam ? handleModTeam : undefined}
                />
            }
        >
            <View>
                <ScrollView>

                    <TeamHeader
                        team={currentTeam}
                        isLoading={isLoading}
                        error={error}
                        onInviteFriendPress={handleFriendInvitation}/>


                </ScrollView>
            </View>

        </Background>
    );
}


const styles = StyleSheet.create({});