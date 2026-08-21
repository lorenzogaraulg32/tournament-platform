import Background from "@/src/components/common/Background";
import {useEffect, useState} from "react";
import {getTeamDetails, TeamDetails} from "@/src/services/teams/teamService";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import TitleApp from "@/src/components/common/headers/HeaderMain";
import {useLocalSearchParams} from "expo-router";
import TeamHeader from "@/src/components/app/teams/TeamHeader";
import InfoLabel from "@/src/components/common/labels/infoLabel";
import {loadCurrentUserId} from "@/src/services/users/authService";
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
            />

            <View style={styles.scrollContainer}>

                <ScrollView style={styles.scroll}>
                    <View style={styles.scrollContent}>

                        {team?.description ? (

                            <View style={styles.section}>
                                <InfoLabel
                                    text={"Bio"}
                                    labelIconName={"information-circle-outline"}
                                />
                                <View
                                    style={styles.descContainer}>
                                    <Text
                                        numberOfLines={5}
                                        style={styles.description}>
                                        {team.description}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View></View>
                        )}

                        <View style={styles.section}>
                            <InfoLabel
                                text={"Players"}
                                labelIconName={"people-outline"}
                            />
                            {team && (
                                <HorizontalCarousel
                                    style={styles.teamCarousel}
                                    transparent
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
                                    style={styles.teamCarousel}
                                    transparent
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


    teamCarousel: {
        marginHorizontal: 0,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderRadius: 0,
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


    descContainer: {
        backgroundColor: "rgba(246,246,246,0.89)",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderRadius: 25,
        borderLeftColor: "#00A859",
        borderRightColor: "#00A859",
    },

    description: {
        fontSize: 14,
        lineHeight: 20,
        color: "#3D4340",
    },


});