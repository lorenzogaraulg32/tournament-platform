import {Redirect, router, useFocusEffect, useLocalSearchParams} from "expo-router";
import {useCallback, useRef, useState} from "react";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {TeamDetails} from "@/src/services/teams/teamsConst";
import {fetchTeam, leaveTeam, refreshInvitationCode,} from "@/src/services/teams/teamService";
import LoadingScreen from "@/src/components/common/loading/LoadingScreen";
import TeamPage from "@/src/components/pagesComponents/teams/TeamPage";
import BackButton from "@/src/components/common/buttons/BackButton";
import OptionsMenu from "@/src/components/common/OptionsMenu";
import {Alert} from "react-native";
import {loadCurrentUserId} from "@/src/services/users/authService";
import ErrorScreen from "@/src/components/common/errors/ErrorScreen";


//qui sai fa il fetch del team e si ritorna il feedback corrispondente

export default function TeamScreen() {


    const params = useLocalSearchParams<{ teamId: string }>();
    const teamId = params.teamId;

    const requestIdRef = useRef(0);
    const leavingInProgressRef = useRef(false);


    const [isLoading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("");

    const [team, setTeam] = useState<TeamDetails | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const fetchTeamDetails = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        if (!teamId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        setTeam(null);
        setCurrentUserId(null);

        try {
            const [loadedTeam, loadedUserId] = await Promise.all([
                fetchTeam(teamId),
                loadCurrentUserId(),
            ]);

            if (requestId !== requestIdRef.current) {
                return;
            }

            if (loadedUserId === null || loadedUserId === undefined) {
                router.replace("/(auth)");
                return;
            }

            setTeam(loadedTeam);
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
        }, [fetchTeamDetails])
    );

    //autorizzazioni utente rispetto al team
    const isTeamOwner =
        team !== null &&
        currentUserId !== null &&
        String(team.creatorId) === currentUserId;

    const isTeamAdmin =
        team !== null &&
        currentUserId !== null &&
        team.adminIds.some((id) => String(id) === currentUserId);

    const canEdit = isTeamOwner || isTeamAdmin;


    const onBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(app)/teams");
        }
    }

    async function onMod(): Promise<void> {
        if (!team) {
            return;
        }

        router.push({
            pathname: "/teams/modify",
            params: {
                team: JSON.stringify(team),
            },
        });
    }

    function canLeave(): boolean {
        if (!team || currentUserId === null || isTeamOwner) {
            return false;
        }

        return team.playerIds.some(
            (id) => String(id) === String(currentUserId)
        );
    }

    async function onLeave(): Promise<void> {
        if (!team || !canLeave() || leavingInProgressRef.current) {
            return;
        }

        leavingInProgressRef.current = true;

        try {
            await leaveTeam(String(team.id));

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

        if (!team || !canEdit) {
            return;
        }

        router.push({
            pathname: "/teams/delete",
            params: {teamId: String(team?.id)},
        });
    }

    async function onRefreshCode() {

        if (!team) {
            throw new Error("La squadra non è disponibile.");
        }

        try{
            const updatedTeam = await refreshInvitationCode(team.id);

            const newCode = updatedTeam.invitationCode;

            if (!newCode) {
                throw new Error("Il server non ha restituito un codice di invito valido.");
            }

            setTeam((previous) => {
                if (!previous) return previous;

                return {
                    ...previous,
                    invitationCode: newCode,
                };
            });

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
    if (!teamId || !team || !currentUserId) {
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
                team={team}
                setTeam={setTeam}
                currentUserId={currentUserId}
                onRefreshCode={onRefreshCode}
                isTeamAdmin={isTeamAdmin}
                isTeamOwner={isTeamOwner}
                isPlayerModalVisible={isPlayersModalVisible}
                setPlayerModalVisible={setIsPlayersModalVisible}/>
        </>
    )

}