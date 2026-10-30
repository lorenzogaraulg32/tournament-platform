import {Alert, StyleSheet, Text, View} from "react-native";
import EntityHeader from "@/src/components/common/layout/headers/EntityHeader";
import CollapsableSection from "@/src/components/common/CollapsableSection";
import StandardCardList from "@/src/components/common/StandardCardList";
import PlayerCard from "@/src/components/common/cards/userCards/PlayerCard";
import AdminCard from "@/src/components/common/cards/userCards/AdminCard";
import {TeamFormation, TeamUpdateRequest} from "@/src/services/teams/teamDTO";
import {Dispatch, ReactNode, SetStateAction, useRef, useState} from "react";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {editTeam, removeTeamAdmin, removeTeamPlayer, updateTeamFormation} from "@/src/services/teams/teamService";
import showAlert from "@/src/components/common/errors/Alert";
import {useToast} from "@/src/components/common/Toast/ToastProvider";
import FieldLineup from "@/src/components/pagesComponents/teams/field/FieldLineup";
import FullPageModal from "@/src/components/common/FullPageModal";
import {Sport} from "@/src/services/users/userDTO";
import TournamentCardHorizontal from "@/src/components/common/cards/tournamentCards/TournamentCardHorizontal";
import {TeamProfile} from "@/src/components/pagesComponents/teams/TeamScreen";
import InfoLabel from "@/src/components/common/labels/InfoLabel";
import {HorizontalSeparator} from "@/src/components/common/HorizontalSeparator";
import {ActivitiesSection} from "@/src/components/common/ActivitiesSection";
import {EntityType} from "@/src/services/activities/ActivityDTO";
import {fetchActivities} from "@/src/services/activities/activityService";
import EntityLayout from "@/src/components/common/layout/EntityLayout";
import EntityTabs from "@/src/components/common/layout/tabs/EntityTabs";


type TeamPageProps = {
    teamProfile: TeamProfile,
    setTeamProfile: Dispatch<SetStateAction<TeamProfile | null>>,
    onRefreshCode: () => Promise<string | undefined>,
    isTeamAdmin: boolean,
    isTeamOwner: boolean,
    currentUserId: string,
    isPlayerModalVisible: boolean,
    setPlayerModalVisible: Dispatch<SetStateAction<boolean>>,
    backBtn?: ReactNode,
    optionsBtn?: ReactNode
};


const teamPageTabs: string[] = ["Info", "Campo", "Notifiche", "Attività", "Admin", "Tornei"]

export default function TeamPage({
                                     teamProfile,
                                     setTeamProfile,
                                     onRefreshCode,
                                     isTeamAdmin,
                                     isTeamOwner,
                                     currentUserId,
                                     isPlayerModalVisible,
                                     setPlayerModalVisible,
                                     backBtn,
                                     optionsBtn
                                 }: TeamPageProps) {


    const {showToast} = useToast();

    //componenti team

    const removalInProgressRef = useRef(false);

    const [tab, setTab] = useState<string>("Info")

    //formazione team
    const formationSaveInProgressRef = useRef(false);
    const [isRemovingMember, setIsRemovingMember] = useState(false);
    const [isSavingFormation, setIsSavingFormation] = useState(false);

    const canEditFormation = isTeamAdmin || isTeamOwner


    function renderTab() {
        switch (tab) {
            case "Info" :
                return (
                    <>
                        <InfoLabel
                            text={"Descrizione"}
                            labelIconName={"clipboard-outline"}/>
                        <HorizontalSeparator/>
                        <Text
                            style={styles.descriptionText}>
                            {teamProfile.team.description || "Nessuna descrizione disponibile"}
                        </Text>
                    </>
                )
            case "Campo":
                return (
                    <CollapsableSection
                        label="Formazione"
                        iconName="shirt-outline"
                        modal={false}
                        maxHeight={1000000}
                        canExpand={false}
                    >

                        <View style={styles.fieldContainer}>
                            <FieldLineup
                                key={teamProfile.team.sport}
                                sport={teamProfile.team.sport}
                                players={teamProfile.players ?? []}
                                formation={teamProfile.team.formation}
                                canEdit={canEditFormation}
                                isSaving={isSavingFormation}
                                disabled={
                                    teamProfile.players === null ||
                                    isRemovingMember
                                }
                                onFormationSave={onFormationSave}
                                onSportChange={onSportChange}
                            />
                        </View>
                    </CollapsableSection>
                )
            case "Notifiche":
                return (
                    <CollapsableSection
                        label="Notifiche"
                        iconName="notifications-outline"
                        modal={false}
                        maxHeight={1000000}
                        canExpand={false}
                    >

                        <Text
                            style={styles.descriptionText}>
                            {"Sezione notifiche coming soon"}
                        </Text>
                    </CollapsableSection>
                )
            case "Attività":
                return (
                    <ActivitiesSection
                        variant={"profile"}
                        activities={teamProfile.activities}
                    />
                )
            case "Admin":
                return (
                    <CollapsableSection
                        label="Admin"
                        iconName="shield-checkmark-outline"
                        canMod={isTeamOwner}
                        maxHeight={1000000}
                        canExpand={false}
                    >
                        {(isMod) => {
                            const canRemove = isMod && isTeamOwner;

                            return (
                                <StandardCardList
                                    items={(teamProfile.admins ?? [])
                                        .filter((admin) =>
                                            !canRemove ||
                                            String(admin.id) !== String(teamProfile.team.creatorId)
                                        )
                                        .map((admin) => (
                                            <AdminCard
                                                key={admin.id}
                                                admin={admin}
                                                isOwner={
                                                    String(teamProfile.team.creatorId) === String(admin.id)
                                                }
                                                onPress={
                                                    canRemove
                                                        ? () => {
                                                            void removeAdminFromTeam(String(admin.id));
                                                        }
                                                        : undefined
                                                }
                                                icon={canRemove ? "exit-outline" : undefined}
                                                iconColor={canRemove ? "#FF7474" : undefined}
                                            />
                                        ))}
                                    emptyMsg={
                                        canRemove
                                            ? "Nessun admin che puoi rimuovere"
                                            : "Nessun admin nella squadra"
                                    }
                                    orientation="vertical"
                                />
                            );
                        }}
                    </CollapsableSection>
                )
            case "Tornei":
                return (
                    <CollapsableSection
                        label="Tornei "
                        iconName="trophy-outline"
                        maxHeight={1000000}
                        canExpand={false}
                    >
                        <StandardCardList
                            items={(teamProfile.tournaments ?? [])
                                .map(tournament => {
                                    return (
                                        <TournamentCardHorizontal
                                            key={tournament.id}
                                            tournament={tournament}/>
                                    );
                                })}
                            isLoading={false}
                            error={null}
                            emptyMsg={"Questa squadra non partecipa a nessun torneo"}
                            orientation="vertical"/>
                    </CollapsableSection>

                )
        }
    }


    async function onSportChange(sport: Sport) {
        if (sport === null) return
        const modTeamData = {
            sport: sport,
        }

        try {
            const request: TeamUpdateRequest = {
                ...modTeamData,
            };

            const newTeam = await editTeam(String(teamProfile.team.id), request)

            setTeamProfile(prev =>
                prev ? {
                    ...prev,
                    team: newTeam
                } : prev
            )

            const activities = await fetchActivities(
                teamProfile.team.id,
                EntityType.TEAM
            );

            setTeamProfile(previous =>
                previous
                    ? {
                        ...previous,
                        activities
                    }
                    : previous
            );
        } catch (error) {
            const apiError = normalizeApiRequestError(error);
            Alert.alert(
                "Errore",
                apiError.message
            );
        }
    }

    function canRemovePlayer(playerId: string): boolean {
        if (!teamProfile.team || currentUserId === null) {
            return false;
        }

        const targetId = String(playerId);

        // Non mostrare se stessi né il creatore tra i rimovibili.
        if (
            targetId === currentUserId ||
            targetId === String(teamProfile.team.creatorId)
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
            !teamProfile.admins.some((id) => String(id) === targetId)
        );
    }

    async function removePlayerFromTeam(id: string): Promise<void> {

        if (
            removalInProgressRef.current ||
            formationSaveInProgressRef.current ||
            !canRemovePlayer(id)
        ) {
            return;
        }

        removalInProgressRef.current = true;
        setIsRemovingMember(true);

        try {
            await removeTeamPlayer(teamProfile.team, id);

            setTeamProfile(previous => {
                if (!previous) return previous;

                return {
                    ...previous,

                    players: previous.players.filter(
                        player => String(player.id) !== String(id)
                    ),

                    admins: previous.admins.filter(
                        admin => String(admin.id) !== String(id)
                    ),

                    team: {
                        ...previous.team,

                        adminIds: previous.team.adminIds.filter(
                            adminId => String(adminId) !== String(id)
                        ),

                        playerIds: previous.team.playerIds.filter(
                            playerId => String(playerId) !== String(id)
                        ),

                        formation: {
                            ...previous.team.formation,

                            slotAssignment: Object.fromEntries(
                                Object.entries(
                                    previous.team.formation.slotAssignment
                                ).filter(
                                    ([, playerId]) => String(playerId) !== String(id)
                                )
                            ),

                            benchOrder: previous.team.formation.benchOrder.filter(
                                playerId => String(playerId) !== String(id)
                            )
                        }
                    }
                };
            });
            const activities = await fetchActivities(
                teamProfile.team.id,
                EntityType.TEAM
            );

            setTeamProfile(previous =>
                previous
                    ? {
                        ...previous,
                        activities
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
            setIsRemovingMember(false);
        }
    }

    async function removeAdminFromTeam(id: string): Promise<void> {

        if (
            removalInProgressRef.current ||
            formationSaveInProgressRef.current ||
            !isTeamOwner ||
            !teamProfile.team ||
            String(id) === String(teamProfile.team.creatorId)
        ) {
            return;
        }

        removalInProgressRef.current = true;
        setIsRemovingMember(true);
        try {
            await removeTeamAdmin(teamProfile.team, id);

            setTeamProfile(previous => {
                if (!previous) return previous;

                return {
                    ...previous,

                    admins: previous.admins.filter(
                        admin => String(admin.id) !== String(id)
                    ),

                    team: {
                        ...previous.team,

                        adminIds: previous.team.adminIds.filter(
                            adminId => String(adminId) !== String(id)
                        )
                    }
                };
            });

            const activities = await fetchActivities(
                teamProfile.team.id,
                EntityType.TEAM
            );

            setTeamProfile(previous =>
                previous
                    ? {
                        ...previous,
                        activities
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
            setIsRemovingMember(false);
        }
    }

    async function onFormationSave(teamFormation: TeamFormation) {
        if (
            !canEditFormation ||
            formationSaveInProgressRef.current ||
            removalInProgressRef.current ||
            teamProfile.players === null
        ) {
            return;
        }

        const isSameFormation =
            JSON.stringify(teamProfile.team.formation) ===
            JSON.stringify(teamFormation);

        if (isSameFormation) {
            showToast("Nessuna modifica alla formazione", true);
            return;
        }

        formationSaveInProgressRef.current = true;
        setIsSavingFormation(true);

        try {
            const savedFormation = await updateTeamFormation(
                teamProfile.team,
                teamFormation
            );

            setTeamProfile(previous =>
                previous
                    ? {
                        ...previous,

                        team: {
                            ...previous.team,
                            formation: savedFormation
                        }
                    }
                    : previous
            );

            const activities = await fetchActivities(
                teamProfile.team.id,
                EntityType.TEAM
            );

            setTeamProfile(previous =>
                previous
                    ? {
                        ...previous,
                        activities
                    }
                    : previous
            );


            showToast("Formazione salvata", true);
        } catch (error) {
            const apiError = normalizeApiRequestError(error)

            if (apiError.status !== 401) {
                showAlert(
                    "Impossibile salvare la formazione",
                    apiError.message,
                )
            }
        } finally {
            formationSaveInProgressRef.current = false;
            setIsSavingFormation(false);
        }
    }

    return (
        <EntityLayout
            header={
                <EntityHeader
                    variant={"teams"}
                    name={teamProfile.team.name}
                    image={teamProfile.team.logo}
                    position={teamProfile.team.location?.label}
                    invitationCode={teamProfile.team.invitationCode}
                    onRefreshCode={isTeamAdmin || isTeamOwner ? onRefreshCode : undefined}
                    backBtn={backBtn}
                    optionsBtn={optionsBtn}
                />
            }
            tabs={
                <EntityTabs
                    tabs={teamPageTabs}
                    currentTab={tab}
                    onChangeTab={(newTab: string) => {
                        console.log("Cambiato tabs in : " + newTab)
                        setTab(newTab)
                    }}
                    variant={"teams"}

                />
            }>


            <FullPageModal
                visible={isPlayerModalVisible}
                onClose={() => setPlayerModalVisible(false)}
                label="Gestisci giocatori"
                iconName="people-outline"
            >
                <StandardCardList
                    items={(teamProfile.players ?? [])
                        .filter((player) =>
                            canRemovePlayer(String(player.id))
                        )
                        .map((player) => (
                            <PlayerCard
                                key={player.id}
                                player={player}
                                sport={teamProfile.team.sport}
                                onPress={() => {
                                    void removePlayerFromTeam(String(player.id));
                                }}
                                icon={"exit-outline"}
                                iconColor={"#FF7474"}
                            />
                        ))}
                    emptyMsg="Nessun giocatore che puoi rimuovere"
                    orientation="vertical"
                />
            </FullPageModal>

            {renderTab()}

        </EntityLayout>
    )

}


const styles = StyleSheet.create({

    descriptionText: {
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 24,
        color: "#333333",
    },

    fieldContainer: {
        marginBottom: 20,
    }


});