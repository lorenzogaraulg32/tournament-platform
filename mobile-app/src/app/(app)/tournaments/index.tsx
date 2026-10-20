import {StyleSheet} from "react-native";
import PageLayout from "@/src/components/common/layout/PageLayout";
import PageHeader from "@/src/components/common/layout/headers/PageHeader";
import {useState} from "react";
import TabsContainer from "@/src/components/common/TabsContainer";
import FindTournaments from "@/src/app/(app)/tournaments/findTournaments";
import MyTournaments from "@/src/app/(app)/tournaments/myTournaments";


const TOURNAMENT_TABS = [
    {
        id: "myTournaments.tsx",
        label: "I miei tornei",
    },
    {
        id: "findTournaments",
        label: "Trova tornei",
    },
] as const;

type TeamTab = typeof TOURNAMENT_TABS[number]["id"];


export default function TournamentsPage() {

    const [activeTab, setActiveTab] = useState<TeamTab>("myTournaments.tsx");

    return (
        <PageLayout
            header={
                <PageHeader
                    label="JoinCup"
                    title="Tornei"
                    subtitle="Gestisci i tuoi tornei e partecipa a nuovi"
                    variant={"tournaments"}
                />
            }
        >


            <TabsContainer
                color={"purple"}
                tabs={TOURNAMENT_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />


            {activeTab === "myTournaments.tsx" ? (
                <MyTournaments/>
            ) : (
                <FindTournaments/>
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



