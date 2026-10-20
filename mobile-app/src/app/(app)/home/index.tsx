import {Alert, ScrollView, StyleSheet} from "react-native";
import PageLayout from "@/src/components/common/layout/PageLayout";
import CodeInput from "@/src/components/pagesComponents/home/CodeInput";
import {addPlayer} from "@/src/services/teams/teamService";
import {router} from "expo-router";
import PageHeader from "@/src/components/common/layout/headers/PageHeader";
import {normalizeApiRequestError} from "@/src/services/errorService";

export default function Homepage() {


    async function joinTeam(code: string) {
        try {
            const team = await addPlayer(code)
            router.push({
                pathname: "/teams/[teamId]",
                params: {
                    teamId: team.id,
                },
            })
        } catch (error) {
            const apiError = normalizeApiRequestError(error)

            Alert.alert(
                "Accesso alla squadra non riuscito",
                apiError.message,
                [
                    {
                        text: "OK",
                    },
                ],
            );
        }
    }

    function joinTournament(code: string) {
        //todo
    }

    return (

        <PageLayout
            header={
                <PageHeader label="Benvenuto in JoinCup"
                            title="Entra in gioco."
                            subtitle="Unisciti a una squadra o partecipa a un torneo."
                            variant={"home"}
                />

            }>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                <CodeInput
                    variant="team"
                    onJoin={joinTeam}
                />

                <CodeInput
                    variant="tournament"
                    onJoin={joinTournament}
                />
            </ScrollView>
        </PageLayout>

    )
}


const styles = StyleSheet.create({


    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        gap: 22,
    },


});