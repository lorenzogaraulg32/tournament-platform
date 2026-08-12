import Background from "@/src/components/common/Background";
import {useEffect, useState} from "react";
import {getTeamDetails, TeamDetails} from "@/src/services/teams/teamGetService";
import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import TitleApp from "@/src/components/common/headers/HeaderMain";
import {useLocalSearchParams} from "expo-router";
import {loadCurrentUserId} from "@/src/services/userService";
import TeamHeader from "@/src/components/app/teams/TeamHeader";
import {colors} from "@/src/constants/theme";
import InfoLabel from "@/src/components/common/labels/infoLabel";
import {LinearGradient} from "expo-linear-gradient";
import TeamPlayerCardSmall from "@/src/components/app/teams/TeamPlayerCardSmall";
import TeamAdminCardSmall from "@/src/components/app/teams/TeamAdminCardSmall";


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


    function handleMoreAdminsPress() {
        return undefined;
    }

    function handleMorePlayersPress() {
        return undefined;
    }

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
            <TeamHeader
                team={currentTeam}
                isLoading={isLoading}
                error={error}
                onInviteFriendPress={handleFriendInvitation}/>

            <View style={styles.scrollContainer}>

                <ScrollView style={styles.scroll}>
                    <View style={styles.scrollContent}>

                        <View style={styles.section}>
                            <InfoLabel
                                text={"Bio"}
                                labelIconName={"information-circle-outline"}
                            />
                            <LinearGradient
                                colors={[colors.textThird, "#EAF8EF", "#F7FCF9"]}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                style={[styles.gradient, styles.descContainer]}
                            >
                                <Text
                                    numberOfLines={5}
                                    style={styles.description}>
                                    {currentTeam?.description || "..."}
                                </Text>
                            </LinearGradient>
                        </View>

                        <View style={styles.section}>
                            <InfoLabel
                                text={"Players"}
                                labelIconName={"people-outline"}
                            />


                            <LinearGradient
                                colors={[colors.textThird, "#EAF8EF", "#ebfff0"]}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                style={[styles.gradient, styles.playersContainer]}
                            >
                                <View style={styles.playersCardContainer}>
                                    <TeamPlayerCardSmall></TeamPlayerCardSmall>
                                    <TeamPlayerCardSmall></TeamPlayerCardSmall>
                                    <TeamPlayerCardSmall></TeamPlayerCardSmall>
                                    <TeamPlayerCardSmall></TeamPlayerCardSmall>
                                    <TeamPlayerCardSmall></TeamPlayerCardSmall>

                                </View>
                                <View>
                                    <Pressable onPress={handleMorePlayersPress()} style={styles.playerCardMore}>
                                        <Text style={styles.playerCardMoreText}>···</Text>
                                    </Pressable>
                                </View>
                            </LinearGradient>

                        </View>

                        <View style={styles.section}>
                            <InfoLabel
                                text={"Admin"}
                                labelIconName={"shield-checkmark-outline"}
                            />


                            <LinearGradient
                                colors={[colors.textThird, "#EAF8EF", "#ebfff0"]}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                style={[styles.gradient, styles.playersContainer]}
                            >
                                <View style={styles.playersCardContainer}>
                                    <TeamAdminCardSmall player={undefined}/>
                                    <TeamAdminCardSmall player={undefined}/>
                                    <TeamAdminCardSmall player={undefined}/>
                                </View>

                                <View>
                                    <Pressable style={styles.playerCardMore}
                                               onPress={handleMoreAdminsPress()}>
                                        <Text style={styles.playerCardMoreText}>···</Text>
                                    </Pressable>
                                </View>

                            </LinearGradient>

                        </View>


                    </View>
                </ScrollView>
            </View>

        </Background>
    )

}


const styles = StyleSheet.create({

    scrollContainer: {
        borderRadius: 28,
    },

    scroll: {
        height: "100%",
        marginTop: -26,
        paddingTop: 36,
        paddingHorizontal: 10,
        paddingBottom: 20,
        backgroundColor: "#ffffff",
        zIndex: -1,
    },

    scrollContent: {
        gap: 12,
    },

    section: {
        gap: 4,
    },

    gradient: {
        borderRadius: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#D0EBDD",
    },

    descContainer: {
        paddingHorizontal: 5,
        borderLeftWidth: 4,
        borderLeftColor: "#00A859",
    },

    description: {
        fontSize: 14,
        lineHeight: 20,
        color: "#3D4340",
    },

    playersContainer: {
        paddingHorizontal: 5,
        justifyContent: "space-between",
        flexDirection: "row",
        gap: 5,
    },

    playersCardContainer: {
        justifyContent: "space-evenly",
        flexDirection: "row",
        gap: 5,
    },

    playerCardMore: {
        flex: 1,
        width: 28,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#D0EBDD",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },

    playerCardMoreText: {
        fontSize: 20,
        fontWeight: 900,
        color: colors.textLightGreen,
    }

});