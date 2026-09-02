import PageLayout from "@/src/components/common/PageLayout";
import {useEffect, useState} from "react";
import {getTeamDetails, TeamDetails} from "@/src/services/teams/teamService";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import HeaderTeam from "@/src/components/pagesComponents/teams/HeaderTeam";
import InfoLabel from "@/src/components/common/labels/InfoLabel";
import TeamCarousel from "@/src/components/common/HorizontalCarousel";
import HorizontalCarousel from "@/src/components/common/HorizontalCarousel";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {loadCurrentUserId} from "@/src/services/users/authService";


export default function teamId() {

    const {teamId} = useLocalSearchParams<{ teamId: string }>();
    const [team, setTeam] = useState<TeamDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCurrentUserTeamAdmin, setIsCurrentUserTeamAdmin] = useState<boolean>(false)


    useEffect(() => {
        let isActive = true

        async function loadTeamInfo() {
            try {
                setIsLoading(true)
                setError(null)
                setTeam(null);
                setIsCurrentUserTeamAdmin(false);


                const [loadedTeam, currentUserId] = await Promise.all([
                    getTeamDetails(teamId),
                    loadCurrentUserId(),
                ]);

                if (!isActive) {
                    return;
                }

                if (loadedTeam.adminIds.includes(currentUserId)) {
                    setIsCurrentUserTeamAdmin(true)
                }

                setTeam(loadedTeam);

            } catch (error) {
                if (!isActive) {
                    return;
                }
                const apiError = normalizeApiRequestError(error)

                // Redirect già gestito da authenticatedFetch
                if (apiError.status === 401) {
                    return;
                }

                setError(apiError.message)
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        void loadTeamInfo()

        return () => {
            isActive = false;
        };

    }, [teamId])


    return (
        <PageLayout
            header={
                <HeaderContainer variant={"orange"}>
                    <HeaderTeam
                        team={team}
                        isLoading={isLoading}
                        error={error}
                        canEdit={isCurrentUserTeamAdmin}
                    />
                </HeaderContainer>
            }
        >
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
        </PageLayout>
    )

}
const styles = StyleSheet.create({

    scroll: {
        flex: 1,
    },

    scrollContent: {
        gap: 24,

        paddingTop: 12,
        paddingBottom: 30,
    },

    section: {},

    teamCarousel: {
        marginHorizontal: 0,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderRadius: 0,
    },

    descContainer: {
        backgroundColor: "#FFFFFF",

        paddingHorizontal: 16,

        marginTop: 10,
        paddingVertical: 14,

        borderRadius: 14,

        borderWidth: 1,
        borderColor: "#E0E7E3",

        borderLeftWidth: 4,
        borderLeftColor: "#00A859",
    },

    description: {
        fontSize: 14,
        lineHeight: 20,
        color: "#3D4340",
    },

});