import Background from "@/src/components/common/Background";
import TitleApp from "@/src/components/app/TitleHeader";
import {ImageBackground, Pressable, StyleSheet, Text, View} from "react-native";
import {useState} from "react";
import MyTeamsTab from "@/src/components/app/teams/MyTeamsTab";
import ButtonBG from "@/src/components/common/ButtonBG";
import {router} from "expo-router";

type TeamsTab = "myTeams" | "findTeam";

export default function TeamsPage() {

    const [activeTab, setActiveTab] = useState<TeamsTab>("myTeams");

    return (
        <Background
            header={
                <TitleApp text="Squadre"/>
            }
        >

            <View style={styles.panelShadow}>
                <View style={styles.container}>

                    <ImageBackground
                        source={require("../../../assets/images/teaminfoSectionBkg.png")}
                        style={styles.tabsContainer}
                        imageStyle={styles.backgroundImage}
                    >
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
                    </ImageBackground>
                    <View style={styles.content}>
                        {activeTab === "myTeams" ? (
                            <View style={styles.myTeamsContent}>

                                <MyTeamsTab/>

                                <ButtonBG
                                    text={"Crea nuova squadra"}
                                    onPress={() => router.push("/teams/create")
                                }/>
                            </View>
                        ) : (
                            <View>

                            </View>
                        )}
                    </View>

                </View>
            </View>
        </Background>
    );
}


const PANEL_RADIUS = 18;

const styles = StyleSheet.create({

    panelShadow: {
        flex: 1,

        borderTopLeftRadius: PANEL_RADIUS,
        borderTopRightRadius: PANEL_RADIUS,

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
    },

    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",

        borderColor: "#FFFFFF",
        borderWidth: 0.5,

        borderTopLeftRadius: PANEL_RADIUS,
        borderTopRightRadius: PANEL_RADIUS,
        overflow: "hidden",
    },

    tabsContainer: {
        flexDirection: "row",
        gap: 6,
        padding: 4,

        alignItems: "center",

        minHeight: 50,

        borderTopLeftRadius: PANEL_RADIUS,
        borderTopRightRadius: PANEL_RADIUS,

        overflow: "hidden",
    },

    backgroundImage: {
        borderTopLeftRadius: PANEL_RADIUS,
        borderTopRightRadius: PANEL_RADIUS,
    },

    tab: {
        flex: 1,
        height: 38,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        paddingHorizontal: 8,
    },

    activeTab: {
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        borderColor: "rgba(255, 255, 255, 0.75)",
        borderWidth: 1,
        opacity: 2.0,
    },

    pressedTab: {
        opacity: 0.8,
    },

    tabText: {
        color: "rgba(255, 255, 255, 0.68)",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },

    activeTabText: {
        color: "#FFFFFF",
    },

    content: {
        flex: 1,
        paddingTop: 12,
        paddingHorizontal: 5
    },

    myTeamsContent: {
        flex: 1,
        minHeight: 0,
    },

    findTeamContent: {
        flex: 1,
    },












});