import {Redirect, router, useFocusEffect, useLocalSearchParams} from "expo-router";
import {useCallback, useRef, useState} from "react";
import {TournamentDetails} from "@/src/services/tournaments/tournamentsDTO";
import {loadTournamentDetails, refreshCodeTournament} from "@/src/services/tournaments/tournamentsService";
import {loadCurrentUserId} from "@/src/services/users/authService";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {Alert} from "react-native";
import LoadingScreen from "@/src/components/common/loading/LoadingScreen";
import ErrorScreen from "@/src/components/common/errors/ErrorScreen";
import BackButton from "@/src/components/common/buttons/BackButton";
import OptionsMenu from "@/src/components/common/OptionsMenu";
import TournamentsPage from "@/src/components/pagesComponents/tournaments/TournamentPage";


export default function TournamentScreen() {


    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const params = useLocalSearchParams<{ tournamentId: string }>();
    const tournamentId = params.tournamentId;

    const [tournament, setTournament] = useState<TournamentDetails | null>(null);
    const requestIdRef = useRef(0);

    const [isTournamentModalVisible, setIsTournamentModalVisible] = useState(false);


    const fetchTournamentDetails = useCallback(async () => {

        const requestId = ++requestIdRef.current;

        if (!tournamentId) {
            setLoading(false)
            return;
        }


        setLoading(true)
        setError("")
        setTournament(null)
        setCurrentUserId(null)


        try {
            const [loadedTournament, loadedUserId] = await Promise.all([
                loadTournamentDetails(tournamentId),
                loadCurrentUserId(),
            ])

            if (requestId !== requestIdRef.current) {
                return;
            }

            if (loadedUserId === null || loadedUserId === undefined) {
                router.replace("/(auth)");
                return;
            }

            setTournament(loadedTournament);
            setCurrentUserId(loadedUserId)

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


    }, [tournamentId])

    useFocusEffect(
        useCallback(() => {
            void fetchTournamentDetails();

            return () => {
                requestIdRef.current++;
            }

        }, [fetchTournamentDetails])
    );

    const isTournamentAdmin =
        !!currentUserId &&
        !!tournament?.adminsId.some(
            id => String(id) === String(currentUserId)
        );

    const isTournamentOwner =
        !!currentUserId &&
        String(tournament?.createdById) === String(currentUserId);

    const canEdit = isTournamentAdmin || isTournamentOwner;
    const canLeave = !isTournamentOwner

    const onBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(app)/tournaments");
        }
    }

    const onMod = () => {
        console.log("onMod")
    }

    const onLeave = () => {
        console.log("onLeave")
    }

    const onDelete = () => {
        console.log("onDelete")
    }

    const onAdminLeave = () => {
        console.log("onAdminLeave")
    }

    async function onRefreshCode() {

        if (!tournament) {
            throw new Error("Il torneo non è disponibile.");
        }

        try {
            const updatedTournament = await refreshCodeTournament(tournament.id);

            const newCode = updatedTournament.invitationCode


            if (!newCode) {
                throw new Error("Il server non ha restituito il codice del torneo")
            }

            setTournament((previous) => {
                if (!previous) return previous;

                return {
                    ...previous,
                    invitationCode: newCode,
                };
            });
            return newCode;

        } catch (error) {
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


    if (!params.tournamentId) {
        return <Redirect href="/(app)/home"/>;
    }

    if (isLoading) {
        return <LoadingScreen message={"Caricamento torneo..."}/>
    }

    if (error) {
        return (
            <ErrorScreen
                title="Impossibile caricare il torneo"
                message={error}
                onRetry={fetchTournamentDetails}
                isRetrying={false}
            />
        );
    }

    if (!tournamentId || !tournament || !currentUserId) {
        return null
    }

    return (<>
            {onBack && <BackButton onPress={onBack}/>}
            {(canEdit || canLeave) && (
                <OptionsMenu
                    onEdit={canEdit ? onMod : undefined}
                    onDelete={isTournamentOwner ? onDelete : undefined}
                    onLeave={canLeave ? onLeave : undefined}
                    onManageTeams={
                        canEdit
                            ? () => setIsTournamentModalVisible(true)
                            : undefined
                    }
                />
            )}
            <TournamentsPage
                tournament={tournament}
                setTournament={setTournament}
                onRefreshCode={onRefreshCode}
                isTournamentAdmin={isTournamentAdmin}
                isTournamentOwner={isTournamentOwner}
                currentUserId={currentUserId}
                isTournamentModalVisible={isTournamentModalVisible}
                setTournamentModalVisible={setIsTournamentModalVisible}
            />
        </>
    )


}