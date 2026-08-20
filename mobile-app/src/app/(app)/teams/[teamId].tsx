import Background from "@/src/components/common/Background";
import {useEffect, useState} from "react";
import {getTeamDetails, TeamDetails} from "@/src/services/teams/teamGetService";
import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import TitleApp from "@/src/components/common/headers/HeaderMain";
import {useLocalSearchParams} from "expo-router";
import TeamHeader from "@/src/components/app/teams/TeamHeader";
import {colors} from "@/src/constants/theme";
import InfoLabel from "@/src/components/common/labels/infoLabel";
import {LinearGradient} from "expo-linear-gradient";
import PlayersCard from "@/src/components/app/teams/PlayersCard";
import AdminsCard from "@/src/components/app/teams/AdminsCard";
import {loadCurrentUserId} from "@/src/services/users/authService";
import {UserEntity} from "@/src/services/users/userService";
import TeamCarousel from "@/src/components/common/HorizontalCarousel";
import HorizontalCarousel from "@/src/components/common/HorizontalCarousel";


export default function teamId() {

    const {teamId} = useLocalSearchParams<{ teamId: string }>();
    const [userId, setUserId] = useState<string | null>(null);
    const [team, setTeam] = useState<TeamDetails | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const canModifyTeam =
        team !== null &&
        userId !== null &&
        team.adminIds.includes(String(userId));


    function handleFriendInvitation() {
        //todo
    }

    function handleModTeam() {
        //todo
    }





    useEffect(() => {

        async function loadUserId() {
            const id = await loadCurrentUserId();
            setUserId(id);
        }

        async function loadTeamInfo() {
            try {
                setIsLoading(true)
                setError(null)
                const loadedTeam = await getTeamDetails(teamId);
                setTeam(loadedTeam);

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




        void loadUserId();
        void loadTeamInfo()
    }, [teamId]);


    function handleMoreAdminsPress() {
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
                team={team}
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
                                    {team?.description || "..."}
                                </Text>
                            </LinearGradient>
                        </View>

                        <View style={styles.section}>
                            <InfoLabel
                                text={"Players"}
                                labelIconName={"people-outline"}
                            />
                            {team && (
                                <HorizontalCarousel
                                    inputEntity={team}
                                    variant="players"
                              />
                            )}
                        </View>


                        <View style={styles.section}>
                            <InfoLabel
                                text={"Admin"}
                                labelIconName={"shield-checkmark-outline"}
                            />


                            {team && (
                                <TeamCarousel
                                    inputEntity={team}
                                    variant="admins"
                                />
                            )}

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



});