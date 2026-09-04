import PageLayout from "@/src/components/common/PageLayout";
import {StyleSheet} from "react-native";
import {useState} from "react";
import MyTeams from "@/src/app/(app)/teams/myTeams";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import HeaderPage from "@/src/components/common/headers/HeaderPage";
import TabsContainer from "@/src/components/common/TabsContainer";
import FindTeams from "@/src/app/(app)/teams/findTeams";

const TEAM_TABS = [
    {
        id: "myTeams",
        label: "Le mie squadre",
    },
    {
        id: "findTeam",
        label: "Trova squadra",
    },
] as const;

type TeamTab = typeof TEAM_TABS[number]["id"];

export default function TeamsPage() {

    const [activeTab, setActiveTab] = useState<TeamTab>("myTeams");

    return (
        <PageLayout
            header={
                <HeaderContainer variant="orange">
                    <HeaderPage
                        label="JoinCup"
                        title="Squadre"
                        subtitle="Gestisci le tue squadre e trovane di nuove."/>
                </HeaderContainer>

            }
            contentStyle={styles.content}>


            <TabsContainer
                color={"orange"}
                tabs={TEAM_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />


            {activeTab === "myTeams" ? (
                <MyTeams/>
            ) : (
                <FindTeams/>
            )}

        </PageLayout>
    );
}


const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 5,
        flex: 1,
        paddingTop: 18,
    },
});