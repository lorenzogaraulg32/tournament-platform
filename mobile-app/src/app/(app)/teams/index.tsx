import PageLayout from "@/src/components/common/PageLayout";
import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {useState} from "react";
import MyTeams from "@/src/app/(app)/teams/myTeams";
import ButtonBackground from "@/src/components/common/buttons/ButtonBackground";
import {router} from "expo-router";
import PageHeader from "@/src/components/common/headers/PageHeader";
import Ionicons from "@expo/vector-icons/Ionicons";

type TeamsTab = "myTeams" | "findTeam";

export default function TeamsPage() {

    const [activeTab, setActiveTab] = useState<TeamsTab>("myTeams");

    return (
        <PageLayout
            header={
                <PageHeader
                    variant="orange"
                    label="JoinCup"
                    title="Squadre"
                    subtitle="Gestisci le tue squadre e trovane di nuove."
                />

            }
        contentStyle={styles.content}>



                <View style={styles.tabsContainer}>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityState={{
                            selected: activeTab === "myTeams",
                        }}
                        onPress={() => setActiveTab("myTeams")}
                        style={({pressed}) => [
                            styles.tab,
                            activeTab === "myTeams" && styles.activeTab,
                            pressed && styles.pressedTab,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "myTeams" && styles.activeTabText,
                            ]}
                        >
                            Le mie squadre
                        </Text>
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityState={{
                            selected: activeTab === "findTeam",
                        }}
                        onPress={() => setActiveTab("findTeam")}
                        style={({pressed}) => [
                            styles.tab,
                            activeTab === "findTeam" && styles.activeTab,
                            pressed && styles.pressedTab,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "findTeam" && styles.activeTabText,
                            ]}
                        >
                            Trova squadra
                        </Text>
                    </Pressable>

                </View>

                <View style={styles.content}>
                    {activeTab === "myTeams" ? (
                        <View style={styles.myTeamsContent}>

                            <MyTeams/>

                            <ButtonBackground
                                text="Crea nuova squadra"
                                onPress={() => router.push("/teams/create")}
                            />

                        </View>
                    ) : (
                        <View style={styles.findTeamContent}>
                            <View style={styles.searchContainer}>
                                <Ionicons
                                    name="search-outline"
                                    size={21}
                                    color="#7A8781"
                                />

                                <TextInput
                                    placeholder="Cerca una squadra..."
                                    placeholderTextColor="#9AA39F"
                                    style={styles.searchInput}
                                />
                            </View>
                        </View>
                    )}
                </View>
        </PageLayout>
    );
}


const styles = StyleSheet.create({

    tabsContainer: {
        flexDirection: "row",
        padding: 4,
        backgroundColor: "#F0F3F1",
        borderRadius: 16,
        gap: 4,
        marginHorizontal: 15,
    },

    tab: {
        flex: 1,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },

    activeTab: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },

    pressedTab: {
        opacity: 0.75,
    },

    tabText: {
        color: "#89928E",
        fontSize: 15,
        fontWeight: "700",
    },

    activeTabText: {
        color: "#C94A06",
    },


    content: {
        flex: 1,
        paddingTop: 18,
        paddingHorizontal: 5,
    },

    myTeamsContent: {
        flex: 1,
        minHeight: 0,
    },

    findTeamContent: {
        flex: 1,
    },

    searchContainer: {
        height: 50,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 16,
        gap: 10,

        backgroundColor: "#FFFFFF",

        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#DDE5E1",

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,

        elevation: 2,
    },

    searchInput: {
        flex: 1,
        height: "100%",

        fontSize: 15,
        fontWeight: "500",

        color: "#173D2C",
    },

});