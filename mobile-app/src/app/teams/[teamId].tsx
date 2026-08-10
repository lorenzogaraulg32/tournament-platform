import Background from "@/src/components/common/Background";
import {useEffect, useState} from "react";
import {getTeamDetails, TeamDetails} from "@/src/services/teams/teamGetService";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import TitleApp from "@/src/components/common/headers/HeaderMain";
import {useLocalSearchParams} from "expo-router";
import {loadCurrentUserId} from "@/src/services/userService";
import TeamHeader from "@/src/components/app/teams/TeamHeader";
import {colors} from "@/src/constants/theme";
import LabelType2 from "@/src/components/common/LabelType2";
import {LinearGradient} from "expo-linear-gradient";


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
            <View style={styles.scrollContainer}>

                <TeamHeader
                    team={currentTeam}
                    isLoading={isLoading}
                    error={error}
                    onInviteFriendPress={handleFriendInvitation}/>

                <ScrollView style={styles.scroll}>
                    <View>

                        <LabelType2
                            text={"Bio"}
                            labelIconName={"information-circle-outline"}
                        />

                        <LinearGradient
                            colors={[colors.textThird, "#EAF8EF", "#F7FCF9"]}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={styles.descContainer}
                        >
                            <Text
                                numberOfLines={5}
                                style={styles.description}>
                                {currentTeam?.description || "..."}
                            </Text>
                        </LinearGradient>
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

        // Fa salire il bianco dietro gli angoli inferiori dell'header
        marginTop: -26,
        paddingTop: 35,

        paddingHorizontal: 20,
        paddingBottom: 20,

        backgroundColor: "#ffffff",

        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        zIndex: -1,
    },


    descContainer: {
        backgroundColor: "#E7F7ED",
        borderRadius: 16,

        paddingHorizontal: 5,
        paddingVertical: 10,

        borderWidth: 1,
        borderColor: "#D0EBDD",

        borderLeftWidth: 4,
        borderLeftColor: "#00A859",
    },

    description: {
        fontSize: 14,
        lineHeight: 20,
        color: "#3D4340",
    },


});