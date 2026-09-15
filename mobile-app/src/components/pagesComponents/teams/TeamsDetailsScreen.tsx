import {Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import {colors} from "@/src/constants/theme";
import {router, useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {
    getTeamDetails,
    leaveTeam,
    removeTeamAdmin,
    removeTeamPlayer,
    TeamDetails
} from "@/src/services/teams/teamService";
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
import Toast from "../../common/Toast";


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
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);


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
                setCurrentUserId(normalizedUserId);

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

    async function onMod(){
        if (!team) {
            return;
        }

        router.push({
            pathname: "/teams/modify",
            params: {
                teamId: String(team.id),
            },
        });
    }


    function canRemovePlayer(playerId: string): boolean {
        if (!team || currentUserId === null) {
            return false;
        }

        const targetId = String(playerId);

        // Non mostrare se stessi né il creatore tra i rimovibili.
        if (
            targetId === currentUserId ||
            targetId === String(team.creatorId)
        ) {
            return false;
        }

        // Il creatore può rimuovere tutti gli altri.
        if (isCurrentUserTeamOwner) {
            return true;
        }

        // Un admin può rimuovere soltanto giocatori non admin.
        return (
            isCurrentUserTeamAdmin &&
            !team.adminIds.some((id) => String(id) === targetId)
        );
    }

    async function removePlayerFromTeam(id: string): Promise<void> {

        setRemovingPlayerId(id);
        setToast(null);

        try {
            await removeTeamPlayer(String(team?.id), id);

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

    async function removeAdminFromTeam(id: string): Promise<void> {
        if (
            !team ||
            removingPlayerId !== null ||
            !isCurrentUserTeamOwner ||
            String(id) === String(team.creatorId)
        ) {
            return;
        }

        setRemovingPlayerId(id);
        setToast(null);

        try {
            await removeTeamAdmin(String(team.id), id);

            setTeamAdmins((previous) =>
                previous.filter((admin) => String(admin.id) !== String(id))
            );

            setTeam((previous) =>
                previous
                    ? {
                        ...previous,
                        adminIds: previous.adminIds.filter(
                            (adminId) => String(adminId) !== String(id)
                        ),
                    }
                    : previous
            );

            setToast({
                message: "Ruolo admin rimosso",
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

    function canLeave(){
        if(currentUserId && team?.adminIds.includes(currentUserId)){
            return false;
        }
        return currentUserId !== String(team?.creatorId);
    }

    async function onLeave(): Promise<void> {
        if (!team) {
            return;
        }

        try {
            await leaveTeam(String(team.id));

            router.replace("/(app)/teams");
        } catch (error) {
            const apiError = normalizeApiRequestError(error);

            // Redirect già gestito dal fetch autenticato.
            if (apiError.status === 401) {
                return;
            }

            Alert.alert(
                "Impossibile abbandonare la squadra",
                apiError.message
            );
        }
    }

    function onDelete() {
        router.push({
            pathname: "/teams/delete",
            params: {teamId: String(team?.id)},
        });
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
                        onMod={onMod}
                        onDelete={onDelete}
                        onLeave={canLeave() ? () => onLeave() : undefined}
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
                        canMod={isCurrentUserTeamAdmin || isCurrentUserTeamOwner}
                        feedback={toast && <Toast message={toast.message} success={toast.success}/>}
                    >
                        {(isMod) => (
                            team && (
                                <CardListContainer
                                    items={teamPlayers
                                        .filter((player) =>
                                            !isMod || canRemovePlayer(String(player.id))
                                        )
                                        .map((player) => (
                                            <PlayersCard
                                                key={player.id}
                                                player={player}
                                                sport={Sport.FOOTBALL}
                                                modify={
                                                    isMod
                                                        ? () => {
                                                            void removePlayerFromTeam(
                                                                String(player.id)
                                                            );
                                                        }
                                                        : undefined
                                                }
                                            />
                                        ))}
                                    emptyMsg={
                                        isMod
                                            ? "Nessun giocatore che puoi rimuovere"
                                            : "Nessun giocatore nella squadra"
                                    }
                                    isLoading={isLoading}
                                    error={error}
                                    orientation="vertical"
                                />
                            )
                        )}
                    </CollapsableSection>


                    <CollapsableSection
                        label="Admin"
                        iconName="shield-checkmark-outline"
                        canMod={isCurrentUserTeamOwner}
                    >
                        {(isMod) => {
                            const canRemove = isMod && isCurrentUserTeamOwner;

                            return team && (
                                <CardListContainer
                                    items={teamAdmins
                                        .filter((admin) =>
                                            !canRemove ||
                                            String(admin.id) !== String(team.creatorId)
                                        )
                                        .map((admin) => (
                                            <AdminsCard
                                                key={admin.id}
                                                admin={admin}
                                                isOwner={
                                                    String(team.creatorId) === String(admin.id)
                                                }
                                                modify={
                                                    canRemove
                                                        ? () => {
                                                            void removeAdminFromTeam(
                                                                String(admin.id)
                                                            );
                                                        }
                                                        : undefined
                                                }
                                            />
                                        ))}
                                    emptyMsg={
                                        canRemove
                                            ? "Nessun admin che puoi rimuovere"
                                            : "Nessun admin nella squadra"
                                    }
                                    isLoading={isLoading}
                                    error={error}
                                    orientation="vertical"
                                />
                            );
                        }}
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


});