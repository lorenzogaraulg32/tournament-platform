import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {TournamentDetails} from "@/src/services/tournaments/tournamentsDTO";
import {useToast} from "@/src/components/common/Toast/ToastProvider";
import {loadUserInfo, UserInfo} from "@/src/services/users/userService";
import {TeamDetails} from "@/src/services/teams/teamsConst";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {fetchTeam} from "@/src/services/teams/teamService";
import PageLayout from "@/src/components/common/PageLayout";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import HeaderEntity from "@/src/components/common/headers/HeaderEntity";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import FullPageModal from "@/src/components/common/FullPageModal";
import CardListContainer from "@/src/components/common/carousel&cards/CardListContainer";
import CollapsableSection from "@/src/components/common/CollapsableSection";
import AdminCard from "@/src/components/common/carousel&cards/userCards/AdminCard";
import {colors} from "@/src/constants/theme";
import TeamCardHorizontal from "@/src/components/common/carousel&cards/teamCards/TeamCardHorizontal";

type TournamentPageProps = {
    tournament: TournamentDetails;
    setTournament: Dispatch<SetStateAction<TournamentDetails | null>>;
    onRefreshCode: () => Promise<string | undefined>;
    isTournamentAdmin: boolean;
    isTournamentOwner: boolean;
    currentUserId: string;
    isTournamentModalVisible: boolean
    setTournamentModalVisible: Dispatch<SetStateAction<boolean>>;
};


export default function TournamentPage({
                                           tournament,
                                           setTournament,
                                           onRefreshCode,
                                           isTournamentAdmin,
                                           isTournamentOwner,
                                           currentUserId,
                                           isTournamentModalVisible,
                                           setTournamentModalVisible,
                                       }: TournamentPageProps) {

    const {showToast} = useToast();

    const [isLoading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("");


    const compsRequestIdRef = useRef(0);
    const removalInProgressRef = useRef(false);
    const [isRemovingTeam, setIsRemovingTeam] = useState(false);

    const [teams, setTeams] = useState<TeamDetails[] | null>([])
    const [tournamentAdmins, setTournamentAdmins] = useState<UserInfo[] | null>([])

    const canManageTeams = isTournamentOwner || isTournamentAdmin;


    async function removeTeam(teamId: string) {
        if (!tournament || !currentUserId || !canManageTeams) {
            return;
        }
        return;
        //todo : fetch rimozione team
    }


    async function removeAdmin(adminId: string) {
        if (!tournament || !currentUserId || !isTournamentOwner) {
            //solo l'owner può rimuovere altri admin
            return
        }
        //todo: fetch per rimozione
        return;
    }

    const fetchTournamentComps = useCallback(async () => {
        const requestId = ++compsRequestIdRef.current;

        setLoading(true);
        setError("");

        try {
            setTeams(null);
            setTournamentAdmins(null);


            if (!tournament) {
                return;
            }

            const teamResults = await Promise.allSettled(
                tournament.registeredTeamIds.map((id) => fetchTeam(id))
            );

            const adminResults = await Promise.allSettled(
                tournament.adminsId.map((id) => loadUserInfo(id))
            );

            if (requestId !== compsRequestIdRef.current) {
                return;
            }

            const loadedTeams = teamResults
                .filter(
                    (result): result is PromiseFulfilledResult<TeamDetails> =>
                        result.status === "fulfilled"
                )
                .map((result) => result.value);

            const loadedAdmins = adminResults
                .filter(
                    (result): result is PromiseFulfilledResult<UserInfo> =>
                        result.status === "fulfilled"
                )
                .map((result) => result.value);

            setTeams(loadedTeams);
            setTournamentAdmins(loadedAdmins);
        } catch (error) {
            if (requestId !== compsRequestIdRef.current) {
                return;
            }


            const apiError = normalizeApiRequestError(error);

            if (apiError.status !== 401) {
                setError(apiError.message);
            }

            console.log(apiError.message)

        } finally {
            if (requestId === compsRequestIdRef.current) {
                setLoading(false);
            }
        }
    }, [tournament.registeredTeamIds, tournament.adminsId]);

    useEffect(() => {
        void fetchTournamentComps();

        return () => {
            compsRequestIdRef.current++;
        };
    }, [fetchTournamentComps]);

    return (
        <PageLayout
            header={
                <HeaderContainer
                    variant={"tournaments"}

                >
                    <HeaderEntity
                        variant={"tournaments"}
                        name={tournament.name}
                        imageUrl={tournament.logoUrl}
                        position={tournament.location?.label}
                        invitationCode={tournament.invitationCode}
                        onRefreshCode={isTournamentAdmin || isTournamentOwner ? onRefreshCode : undefined}
                        style={styles.header}
                    />
                </HeaderContainer>
            }
        >


            <ScrollView style={styles.scroll}
                        showsVerticalScrollIndicator={false}>
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

                    <FullPageModal
                        visible={isTournamentModalVisible}
                        onClose={() => setTournamentModalVisible(false)}
                        label="Gestisci squadre"
                        iconName="people-outline"
                    >
                        <CardListContainer
                            items={(teams ?? [])
                                .map((team) => (
                                    <TeamCardHorizontal
                                        key={team.id}
                                        id={team.id}
                                        name={team.name}
                                        imageUrl={team.imageUrl}
                                        playersCount={team.playerIds.length}
                                        modify={() => {
                                            void removeTeam(
                                                String(team.id)
                                            );
                                        }}
                                    />
                                ))}
                            emptyMsg="Nessuna squadra che puoi rimuovere"
                            isLoading={isLoading}
                            error={error}
                            orientation="vertical"
                        />
                    </FullPageModal>


                    <CollapsableSection
                        label="Admin"
                        iconName="shield-checkmark-outline"
                        canMod={isTournamentOwner}
                    >
                        {(isMod) => {
                            const canRemove = isMod && isTournamentOwner;

                            return (
                                <CardListContainer
                                    items={(tournamentAdmins ?? [])
                                        .filter((admin) =>
                                            !canRemove ||
                                            String(admin.id) !== String(tournament.createdById)
                                        )
                                        .map((admin) => (
                                            <AdminCard
                                                key={admin.id}
                                                admin={admin}
                                                isOwner={isTournamentOwner}
                                                modify={
                                                    canRemove ? () => {
                                                            void removeAdmin(String(admin.id));
                                                        }
                                                        : undefined
                                                }
                                            />
                                        ))}
                                    emptyMsg={
                                        canRemove
                                            ? "Nessun admin che puoi rimuovere"
                                            : "Nessun admin nel torneo"
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
        flex: 1,
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

    fieldContainer: {
        marginBottom: 20,
    },

    header: {},


});