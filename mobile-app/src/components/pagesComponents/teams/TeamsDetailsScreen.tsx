import {ScrollView, StyleSheet, Text, View} from "react-native";
import {colors} from "@/src/constants/theme";
import {router, useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {getTeamDetails, removeTeamPlayer, TeamDetails} from "@/src/services/teams/teamService";
import {loadUserInfo, UserEntity} from "@/src/services/users/userService";
import {loadCurrentUserId} from "@/src/services/users/authService";
import {normalizeApiRequestError} from "@/src/services/errorService";
import PageLayout from "@/src/components/common/PageLayout";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import HeaderTeam from "@/src/components/pagesComponents/teams/HeaderTeam";
import CardListContainer from "@/src/components/common/carousel&cards/CardListContainer";
import PlayersCard from "@/src/components/pagesComponents/profile/cards/PlayersCard";
import {Sport} from "@/src/services/users/userConstants";
import AdminsCard from "@/src/components/pagesComponents/profile/cards/AdminsCard";
import CollapsableSection from "@/src/components/common/CollapsableSection";


export default function TeamsDetailsScreen() {

    const {teamId} = useLocalSearchParams<{ teamId: string }>();
    const [team, setTeam] = useState<TeamDetails | null>(null);
    const [teamPlayers, setTeamPlayers] = useState<UserEntity[]>([])
    const [teamAdmins, setTeamAdmins] = useState<UserEntity[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCurrentUserTeamAdmin, setIsCurrentUserTeamAdmin] = useState<boolean>(false)
    const [isCurrentUserTeamOwner, setIsCurrentUserTeamOwner] = useState<boolean>(false)

    const [removingPlayerId, setRemovingPlayerId] = useState<string | null>(null);

    const [toast, setToast] = useState<{
        message: string;
        success: boolean;
    } | null>(null);

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timeout = setTimeout(() => setToast(null), 3000);

        return () => clearTimeout(timeout);
    }, [toast]);

    const onBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(app)/teams");
        }
    }


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

                const loadedPlayers = await Promise.all(
                    loadedTeam.playerIds.map(async (id) => {
                        const userInfo =
                            await loadUserInfo(id);

                        return {
                            id,
                            userInfo,
                        };
                    })
                );

                const loadedAdmins = await Promise.all(
                    loadedTeam.adminIds.map(async (id) => {
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

                const normalizedUserId = String(currentUserId);

                setIsCurrentUserTeamAdmin(
                    loadedTeam.adminIds.some(
                        (id) => String(id) === normalizedUserId
                    )
                );

                setIsCurrentUserTeamOwner(
                    String(loadedTeam.creatorId) === normalizedUserId
                );

                setTeamPlayers(loadedPlayers)
                setTeamAdmins(loadedAdmins)
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


    async function removePlayerFromTeam(id: string): Promise<void> {
        if (!team || removingPlayerId !== null) {
            return;
        }

        setRemovingPlayerId(id);
        setToast(null);

        try {
            await removeTeamPlayer(String(team.id), id);

            setTeamPlayers((previous) =>
                previous.filter((player) => String(player.id) !== String(id))
            );

            setTeam((previous) =>
                previous
                    ? {
                        ...previous,
                        playerIds: previous.playerIds.filter(
                            (playerId) => String(playerId) !== String(id)
                        ),
                    }
                    : previous
            );

            setToast({
                message: "Eliminazione completata",
                success: true,
            });
        } catch (error) {
            const apiError = normalizeApiRequestError(error);

            // Redirect già gestito dal fetch autenticato.
            if (apiError.status === 401) {
                return;
            }

            setToast({
                message: "C'è stato un errore",
                success: false,
            });
        } finally {
            setRemovingPlayerId(null);
        }
    }

    return (
        <PageLayout
            header={
                <HeaderContainer variant={"teams"}>
                    <HeaderTeam
                        team={team}
                        isLoading={isLoading}
                        error={error}
                        canEdit={isCurrentUserTeamAdmin}
                        onBack={onBack}
                    />
                </HeaderContainer>
            }
        >
            <ScrollView style={styles.scroll}>
                <View style={styles.scrollContent}>

                    {team?.description ? (

                        <View style={styles.descriptionContainer}>
                            <View style={styles.descriptionAccent}/>

                            <Text style={styles.description}>
                                {team.description}
                            </Text>
                        </View>

                    ) : (
                        <View></View>
                    )}

                    <CollapsableSection
                        label="Players"
                        iconName="people-outline"
                        canMod={isCurrentUserTeamAdmin}
                        feedback={
                            toast && (
                                <View
                                    pointerEvents="none"
                                    style={[
                                        styles.toast,
                                        {
                                            backgroundColor: toast.success
                                                ? "#166534"
                                                : "#B42318",
                                        },
                                    ]}
                                    accessibilityLiveRegion="polite"
                                >
                                    <Text style={styles.toastText}>
                                        {toast.message}
                                    </Text>
                                </View>
                            )
                        }
                    >
                        {(isMod) => (
                            team && (
                                <CardListContainer
                                    items={teamPlayers.map((player) => (
                                        <PlayersCard
                                            key={player.id}
                                            player={player}
                                            sport={Sport.FOOTBALL}
                                            modify={isMod
                                                ? () => {
                                                    void removePlayerFromTeam(String(player.id));
                                                }
                                                : undefined}
                                        />
                                    ))}
                                    emptyMsg="Nessun giocatore nella squadra"
                                    isLoading={isLoading}
                                    error={error}
                                    orientation="vertical"
                                />
                            )
                        )}
                    </CollapsableSection>


                    <CollapsableSection label={"Admin"} iconName={"shield-checkmark-outline"}
                                        canMod={isCurrentUserTeamOwner}>

                        {team && (
                            <CardListContainer
                                items={teamAdmins.map((player) => (
                                    <AdminsCard
                                        key={player.id}
                                        admin={player}
                                        isOwner={String(team.creatorId) === String(player.id)}/>
                                ))}
                                emptyMsg={"Nessun admin nella squadra"}
                                isLoading={isLoading}
                                error={error}
                                orientation={"vertical"}
                            />
                        )}
                    </CollapsableSection>
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
        gap: 20,

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
        backgroundColor: colors.orangeDefault,
    },

    description: {
        flex: 1,
        fontSize: 16,
        lineHeight: 23,
        fontWeight: "400",
        color: "#3F3F46",
    },

    toast: {
        position: "absolute",
        bottom: 40,
        left: 24,
        right: 24,
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.18,
        shadowRadius: 6,
    },

    toastText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },

});