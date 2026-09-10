import PageLayout from "@/src/components/common/PageLayout";
import {useEffect, useState} from "react";
import {getTeamDetails, teamDetailsToTeamInfo, TeamInfo} from "@/src/services/teams/teamService";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import InfoLabel from "@/src/components/common/labels/InfoLabel";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {loadCurrentUserId} from "@/src/services/users/authService";
import CardListContainer from "@/src/components/common/carousel&cards/CardListContainer";
import {loadUserInfo, UserEntity} from "@/src/services/users/userService";
import AdminsCard from "@/src/components/pagesComponents/profile/cards/AdminsCard";
import {TournamentDetails} from "@/src/services/tournaments/tournamentsDTO";
import {loadTournamentDetails} from "@/src/services/tournaments/tournamentsService";
import HeaderTournament from "@/src/components/pagesComponents/tournaments/HeaderTournament";
import {colors} from "@/src/constants/theme";


export default function TournamentDetailsPage() {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {teamId} = useLocalSearchParams<{ teamId: string }>();
    const [tournament, setTournament] = useState<TournamentDetails | null>(null);
    const [tournamentTeams, setTournamentTeams] = useState<TeamInfo[]>([])
    const [tournamentAdmins, setTournamentAdmins] = useState<UserEntity[]>([])
    const [isCurrentUserTournamentAdmin, setIsCurrentUserTournamentAdmin] = useState<boolean>(false)
    const [isCurrentUserTournamentOwner, setIsCurrentUserTournamentOwner] = useState<boolean>(false)

    const onBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(app)/tournaments");
        }
    }

    useEffect(() => {
        let isActive = true

        async function loadTournamentInfo() {
            try {
                setIsLoading(true)
                setError(null)
                setTournament(null);
                setIsCurrentUserTournamentAdmin(false);


                const [loadedTournament, currentUserId] = await Promise.all([
                    loadTournamentDetails(teamId),
                    loadCurrentUserId(),
                ]);


                const loadedTeams = await Promise.all(
                    loadedTournament.registeredTeamIds.map(async (id) => {
                        const teamDetails = await getTeamDetails(id);
                        return teamDetailsToTeamInfo(teamDetails)
                    })
                );

                const loadedAdmins = await Promise.all(
                    loadedTournament.adminsId.map(async (id) => {
                        const userInfo =
                            await loadUserInfo(id);
                        return {
                            id,
                            userInfo,
                        };
                    })
                );

                if (!isActive) {
                    return;
                }

                if (loadedTournament.adminsId.includes(currentUserId)) {
                    setIsCurrentUserTournamentAdmin(true)
                }

                if (loadedTournament.createdById === currentUserId) {
                    setIsCurrentUserTournamentOwner(true)
                }

                setTournamentAdmins(loadedAdmins)
                setTournamentTeams(loadedTeams)
                setTournament(loadedTournament);

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

        void loadTournamentInfo()

        return () => {
            isActive = false;
        };

    }, [teamId])


    return (
        <PageLayout
            header={
                <HeaderContainer variant={"tournaments"}>
                    <HeaderTournament
                        tournament={tournament}
                        isLoading={isLoading}
                        error={error}
                        canEdit={isCurrentUserTournamentAdmin}
                        onBack={onBack}
                    />
                </HeaderContainer>
            }
        >
            <ScrollView style={styles.scroll}>
                <View style={styles.scrollContent}>

                    {tournament?.description ? (
                        <View style={styles.descriptionContainer}>
                            <View style={styles.descriptionAccent}/>

                            <Text style={styles.description}>
                                {tournament.description}
                            </Text>
                        </View>

                    ) : (
                        <View></View>
                    )}

                    <View style={styles.section}>
                        <InfoLabel
                            text={"Squadre"}
                            labelIconName={"people-outline"}
                        />
                    </View>


                    <View style={styles.section}>
                        <InfoLabel
                            text={"Admin"}
                            labelIconName={"shield-checkmark-outline"}
                        />


                        {tournament && (
                            <CardListContainer
                                items={tournamentAdmins.map((player) => (
                                    <AdminsCard
                                        key={player.id}
                                        admin={player}
                                        isOwner={isCurrentUserTournamentOwner}/>
                                ))}
                                emptyMsg={"Nessun admin del torneo"}
                                isLoading={isLoading}
                                error={error}
                                orientation={"vertical"}/>
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

        paddingBottom: 30,
    },

    section: {},

    teamCarousel: {
        marginHorizontal: 0,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderRadius: 0,
    },

    descriptionContainer: {
        flexDirection: "row",
        alignItems: "stretch",
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: "rgba(102, 32, 150, 0.06)",
        borderRadius: 12,
    },

    descriptionAccent: {
        width: 4,
        marginRight: 12,
        borderRadius: 4,
        backgroundColor: colors.purpleDefault,
    },

    description: {
        flex: 1,
        fontSize: 16,
        lineHeight: 23,
        fontWeight: "400",
        color: "#3F3F46",
    },

});