import {ScrollView, StyleSheet, View} from "react-native";
import PageLayout from "@/src/components/common/PageLayout";
import {corners} from "@/src/constants/theme";
import CodeInput from "@/src/components/app/home/CodeInput";
import {addCurrentUserToTeamViaCode} from "@/src/services/teams/teamService";
import {router} from "expo-router";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import HeaderPage from "@/src/components/common/headers/HeaderPage";

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
                <HeaderContainer variant="green">
                    <HeaderPage label="Benvenuto in JoinCup"
                                title="Entra in gioco."
                                subtitle="Unisciti a una squadra o partecipa a un torneo."/>
                </HeaderContainer>
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