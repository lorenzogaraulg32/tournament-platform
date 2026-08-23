import {ImageBackground, ScrollView, StyleSheet, Text, View} from "react-native";
import PageLayout from "@/src/components/common/PageLayout";
import {colors, corners} from "@/src/constants/theme";
import CodeInput from "@/src/components/app/home/CodeInput";
import {addCurrentUserToTeamViaCode} from "@/src/services/teams/teamService";
import {router} from "expo-router";
import PageHeader from "@/src/components/common/headers/PageHeader";

export default function Homepage() {


    async function joinTeam(code: string) {
        const team = await addCurrentUserToTeamViaCode(code)
        router.push({
            pathname: "/teams/[teamId]",
            params: {
                teamId: team.id,
            },
        })
    }

    function joinTournament(code: string) {

    }

    return (

        <PageLayout
            header={
                <PageHeader
                    variant="green"
                    label="Benvenuto in JoinCup"
                    title="Entra in gioco."
                    subtitle="Unisciti a una squadra o partecipa a un torneo."
                />
            }>
            <View style={styles.scrollContainer}></View>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                <CodeInput
                    variant="team"
                    onJoin={(code) => joinTeam(code)}
                />

                <CodeInput
                    variant="tournament"
                    onJoin={(code) => joinTournament(code)}
                />
            </ScrollView>
        </PageLayout>

    )
}


const styles = StyleSheet.create({

    scrollContainer: {
        borderRadius: corners.standard,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        gap: 22,
    },


});