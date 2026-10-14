import {Redirect, router, useFocusEffect, useLocalSearchParams} from "expo-router";
import {useCallback, useRef, useState} from "react";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {TeamDetails} from "@/src/services/teams/teamDTO";
import {fetchTeam, leaveTeam, refreshInvitationCode,} from "@/src/services/teams/teamService";
import LoadingScreen from "@/src/components/common/loading/LoadingScreen";
import TeamPage from "@/src/components/pagesComponents/teams/TeamPage";
import BackButton from "@/src/components/common/buttons/BackButton";
import OptionsMenu from "@/src/components/common/OptionsMenu";
import {Alert} from "react-native";
import {loadCurrentUserId} from "@/src/services/users/authService";
import ErrorScreen from "@/src/components/common/errors/ErrorScreen";
import {TournamentDetails} from "@/src/services/tournaments/tournamentDTO";
import { UserInfo } from "@/src/services/users/userDTO";
import {fetchUser} from "@/src/services/users/userService";
import {fetchTeamTournaments} from "@/src/services/tournaments/tournamentService";
import {ActivityResponse, EntityType} from "@/src/services/activities/ActivityDTO";
import {fetchActivities} from "@/src/services/activities/activityService";



//qui sai fa il fetch del team e si ritorna il feedback corrispondente
export type TeamProfile = {
    team: TeamDetails,
    tournaments: TournamentDetails[],
    players: UserInfo[]
    admins: UserInfo[]
    activities: ActivityResponse[]
}


export default function TeamScreen() {


    const params = useLocalSearchParams<{ teamId: string }>();
    const teamId = params.teamId;

    const requestIdRef = useRef(0);
    const leavingInProgressRef = useRef(false);


    const [isLoading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("");

    const [teamProfile, setTeamProfile] = useState<TeamProfile| null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const fetchTeamDetails = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        if (!teamId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        setTeamProfile(null);
        setCurrentUserId(null);

        try {

            const loadedTeam = await fetchTeam(teamId)

            const [loadedUserId, tournaments, playersId, adminsId] = await Promise.all([
                loadCurrentUserId(),
                fetchTeamTournaments(loadedTeam.id),
                Promise.all(loadedTeam.playerIds.map((id) => fetchUser(id))),
                Promise.all(loadedTeam.adminIds.map((id) => fetchUser(id))),
            ]);

            if (requestId !== requestIdRef.current) {
                return;
            }

            if (loadedUserId === null || loadedUserId === undefined) {
                router.replace("/(auth)");
                return;
            }

            const teamProfile : TeamProfile = {
                team: loadedTeam,
                tournaments: tournaments,
                players: playersId,
                admins: adminsId,
                activities: []
            }

            setTeamProfile(teamProfile);

            try {
                const activities = await fetchActivities(teamId, EntityType.TEAM)
                setTeamProfile(prev => {
                    if (prev === null) return null;
                    return {
                        ...prev,
                        activities: activities,
                    }
                });

            } catch (activitiesError) {
                if (requestId !== requestIdRef.current) {
                    return;
                }
                console.log("Errore recupero attività squadra")
                console.log(activitiesError)
            }


            setCurrentUserId(String(loadedUserId));
        } catch (error) {
            if (requestId !== requestIdRef.current) {
                return;
            }

            const apiError = normalizeApiRequestError(error);

            if (apiError.status !== 401) {
                setError(apiError.message);
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, [teamId]);

    const [isPlayersModalVisible, setIsPlayersModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            void fetchTeamDetails();

            return () => {
                requestIdRef.current++;
            };
        }, [fetchTeamDetails, ])
    );

    //autorizzazioni utente rispetto al team
    const isTeamOwner =
        teamProfile !== null &&
        currentUserId !== null &&
        String(teamProfile.team.creatorId) === currentUserId;

    const isTeamAdmin =
        teamProfile !== null &&
        currentUserId !== null &&
        teamProfile.team.adminIds.some((id) => String(id) === currentUserId);

    const canEdit = isTeamOwner || isTeamAdmin;


    const onBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(app)/teams");
        }
    }

    async function onMod(): Promise<void> {
        if (!teamProfile) {
            return;
        }

        router.push({
            pathname: "/teams/modify",
            params: {
                team: JSON.stringify(teamProfile),
            },
        });
    }

    function canLeave(): boolean {
        if (!teamProfile || currentUserId === null || isTeamOwner) {
            return false;
        }

        return teamProfile.team.playerIds.some(
            (id) => String(id) === String(currentUserId)
        );
    }

    async function onLeave(): Promise<void> {
        if (!teamProfile || !canLeave() || leavingInProgressRef.current) {
            return;
        }

        leavingInProgressRef.current = true;

        try {
            await leaveTeam(teamProfile.team);

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

            router.replace("/(app)/teams");
        } catch (error) {
            const apiError = normalizeApiRequestError(error);

            if (apiError.status !== 401) {
                Alert.alert(
                    "Impossibile abbandonare la squadra",
                    apiError.message
                );
            }
        } finally {
            leavingInProgressRef.current = false;
        }
    }

    function onDelete() {

        if (!teamProfile || !canEdit) {
            return;
        }



        router.push({
            pathname: "/teams/delete",
            params: {teamId: String(teamProfile?.team.id)},
        });
    }

    async function onRefreshCode() {

        if (!teamProfile) {
            throw new Error("La squadra non è disponibile.");
        }

        try{
            const updatedTeam = await refreshInvitationCode(teamProfile.team.id);

            const newCode = updatedTeam.invitationCode;

            if (!newCode) {
                throw new Error("Il server non ha restituito un codice di invito valido.");
            }

            setTeamProfile(previous =>
                previous
                    ? {
                        ...previous,
                        team: {
                            ...previous.team,
                            invitationCode: newCode
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

            return newCode;

        }catch (error){
            const apiError =
                normalizeApiRequestError(error);

            // Redirect già gestito centralmente
            if (apiError.status === 401) {
                return;
            }

            Alert.alert(
                "Impossibile aggiornare il codice",
                apiError.message,
            );
        }



    }


    if (!params.teamId) {
        return <Redirect href="/(app)/home"/>;
    }

    if (isLoading) {
        return <LoadingScreen message={"Caricamento squadra..."}/>
    }

    if (error) {
        return (
            <ErrorScreen
                title="Impossibile caricare la squadra"
                message={error}
                onRetry={fetchTeamDetails}
                isRetrying={false}
            />
        );
    }

    //caso di errore gestito dall'alert, magari in futuro mettiamo uno schermo adhoc
    if (!teamId || !teamProfile || !currentUserId) {
        return null
    }


    return (<>
            {onBack && <BackButton onPress={onBack}/>}
            {(canEdit || canLeave()) && (
                <OptionsMenu
                    onEdit={canEdit ? onMod : undefined}
                    onDelete={canEdit ? onDelete : undefined}
                    onLeave={canLeave() ? onLeave : undefined}
                    onManagePlayers={
                        isTeamAdmin || isTeamOwner
                            ? () => setIsPlayersModalVisible(true)
                            : undefined
                    }
                />
            )}
            <TeamPage
                teamProfile={teamProfile}
                setTeamProfile={setTeamProfile}
                currentUserId={currentUserId}
                onRefreshCode={onRefreshCode}
                isTeamAdmin={isTeamAdmin}
                isTeamOwner={isTeamOwner}
                isPlayerModalVisible={isPlayersModalVisible}
                setPlayerModalVisible={setIsPlayersModalVisible}/>
        </>
    )

}