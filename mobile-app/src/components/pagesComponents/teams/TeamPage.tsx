//questa sarà la view del team, che contiene header ecc.

import {ScrollView, StyleSheet, Text, View} from "react-native";
import PageLayout from "@/src/components/common/PageLayout";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import HeaderEntity from "@/src/components/common/headers/HeaderEntity";
import CollapsableSection from "@/src/components/common/CollapsableSection";
import CardListContainer from "@/src/components/common/carousel&cards/CardListContainer";
import PlayerCard from "@/src/components/common/carousel&cards/PlayerCard";
import AdminCard from "@/src/components/common/carousel&cards/AdminCard";
import {colors} from "@/src/constants/theme";
import {TeamDetails} from "@/src/services/teams/teamsConst";
import {loadUserInfo, UserInfo} from "@/src/services/users/userService";
import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {removeTeamAdmin, removeTeamPlayer} from "@/src/services/teams/teamService";
import showAlert from "@/src/components/common/errors/Alert";
import {useToast} from "@/src/components/common/Toast/ToastProvider";


type TeamPageProps = {
    team: TeamDetails;
    setTeam: Dispatch<SetStateAction<TeamDetails | null>>;
    onRefreshCode: () => Promise<string>;
    isTeamAdmin: boolean;
    isTeamOwner: boolean;
    currentUserId: string;
};


export default function TeamPage({
                                     team,
                                     setTeam,
                                     onRefreshCode,
                                     isTeamAdmin,
                                     isTeamOwner,
                                     currentUserId
                                 }: TeamPageProps) {


    const {showToast} = useToast();

    const [isLoading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("");
    //componenti team
    const componentsRequestIdRef = useRef(0);
    const removalInProgressRef = useRef(false);
    const [teamPlayers, setTeamPlayers] = useState<UserInfo[] | null>([])
    const [teamAdmins, setTeamAdmins] = useState<UserInfo[] | null>([])
    const fetchTeamComponents = useCallback(async () => {
        const requestId = ++componentsRequestIdRef.current;

        setLoading(true);
        setError("");

        try {
            setTeamPlayers(null);
            setTeamAdmins(null);

            if (!team) {
                return;
            }

            const [loadedPlayers, loadedAdmins] = await Promise.all([
                Promise.all(team.playerIds.map((id) => loadUserInfo(id))),
                Promise.all(team.adminIds.map((id) => loadUserInfo(id))),
            ]);

            if (requestId !== componentsRequestIdRef.current) {
                return;
            }


            setTeamPlayers(loadedPlayers);
            setTeamAdmins(loadedAdmins);
        } catch (error) {
            if (requestId !== componentsRequestIdRef.current) {
                return;
            }

            const apiError = normalizeApiRequestError(error);

            if (apiError.status !== 401) {
                setError(apiError.message);
            }

        } finally {
            if (requestId === componentsRequestIdRef.current) {
                setLoading(false);
            }
        }
    }, [team.playerIds, team.adminIds]);

    useEffect(() => {
        void fetchTeamComponents();

        return () => {
            componentsRequestIdRef.current++;
        };
    }, [fetchTeamComponents]);


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
        if (isTeamOwner) {
            return true;
        }

        // Un admin può rimuovere soltanto giocatori non admin.
        return (
            Boolean(isTeamAdmin) &&
            !team.adminIds.some((id) => String(id) === targetId)
        );
    }

    async function removePlayerFromTeam(id: string): Promise<void> {

        if (removalInProgressRef.current || !canRemovePlayer(id)) {
            return;
        }

        removalInProgressRef.current = true;

        try {
            await removeTeamPlayer(String(team?.id), id);


            setTeamPlayers((previous) =>
                previous
                    ? previous.filter((player) => String(player.id) !== String(id))
                    : previous
            );


            setTeamAdmins((previous) =>
                previous
                    ? previous.filter((admin) => String(admin.id) !== String(id))
                    : previous
            );

            setTeam((previous) =>
                previous
                    ? {
                        ...previous,
                        adminIds: previous.adminIds.filter(
                            (adminId) => String(adminId) !== String(id)
                        ),
                        playerIds: previous.playerIds.filter(
                            (playerId) => String(playerId) !== String(id)
                        )
                    }
                    : previous
            );

            showToast("Eliminazione completata", true);
        } catch (error) {
            const apiError = normalizeApiRequestError(error);

            // Redirect già gestito dal fetch autenticato.
            if (apiError.status !== 401) {
                showAlert(
                    "Impossibile rimuovere il giocatore",
                    apiError.message,
                )
            }
        } finally {
            removalInProgressRef.current = false;
        }
    }

    async function removeAdminFromTeam(id: string): Promise<void> {

        if (
            removalInProgressRef.current ||
            !isTeamOwner || !team ||
            String(id) === String(team.creatorId)
        ) {
            return;
        }

        removalInProgressRef.current = true;

        try {
            await removeTeamAdmin(String(team.id), id);

            setTeamAdmins((previous) =>
                previous
                    ? previous.filter((admin) => String(admin.id) !== String(id))
                    : previous
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

            showToast("Admin rimosso correttamente", true);

        } catch (error) {
            const apiError = normalizeApiRequestError(error);

            if (apiError.status !== 401) {
                showAlert(
                    "Impossibile rimuovere l'amministratore",
                    apiError.message,
                )
            }
        } finally {
            removalInProgressRef.current = false;
        }
    }


    return (
        <PageLayout
            header={
                <HeaderContainer
                    variant={"teams"}
                >
                    <HeaderEntity
                        variant={"teams"}
                        name={team.name}
                        imageUrl={team.imageUrl}
                        position={team.location?.label}
                        invitationCode={team.invitationCode}
                        onRefreshCode={isTeamAdmin || isTeamOwner ? onRefreshCode : undefined}
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
                        canMod={isTeamAdmin || isTeamOwner}
                    >
                        {(isMod) => ((
                                <CardListContainer
                                    items={(teamPlayers ?? [])
                                        .filter((player) =>
                                            !isMod || canRemovePlayer(String(player.id))
                                        )
                                        .map((player) => (
                                            <PlayerCard
                                                key={player.id}
                                                player={player}
                                                sport={team.sport}
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
                        canMod={isTeamOwner}
                    >
                        {(isMod) => {
                            const canRemove = isMod && isTeamOwner;

                            return (
                                <CardListContainer
                                    items={(teamAdmins ?? [])
                                        .filter((admin) =>
                                            !canRemove ||
                                            String(admin.id) !== String(team.creatorId)
                                        )
                                        .map((admin) => (
                                            <AdminCard
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