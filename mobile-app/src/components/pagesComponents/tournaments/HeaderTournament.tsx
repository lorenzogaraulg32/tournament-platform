import {ActivityIndicator, Alert, Pressable, StyleSheet, Text, View,} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Picture from "@/src/components/common/images/Picture";
import {useEffect, useRef, useState} from "react";
import * as Clipboard from "expo-clipboard";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {TournamentDetails} from "@/src/services/tournaments/tournamentsDTO";
import {refreshCodeTournament} from "@/src/services/tournaments/tournamentsService";
import BackButton from "@/src/components/common/buttons/BackButton";
import SettingsButton from "@/src/components/common/buttons/SettingsButton";

type TournamentHeaderProps = {
    tournament: TournamentDetails | null;
    isLoading?: boolean;
    error?: string | null;
    canEdit: boolean;
    onBack: () => void;
};


/**
 *
 * @param team la squadra selezionata
 * @param isLoading se la squadra sta caricando
 * @param error se c'è stato un errore nel caricamento della squadra
 * @constructor
 */
export default function HeaderTournament({
                                             tournament,
                                             isLoading = false,
                                             error = null,
                                             canEdit,
                                             onBack
                                         }: TournamentHeaderProps) {


    function formatLocationLabel(location: string): string {
        if (location) {
            return location
                .split(",")
                .map(part => part.trim())
                .filter(Boolean)
                .join("  ·  ");
        }
        return ""

    }

    const onBackPress = () => {
        onBack()
    }


    const onOptionsPress = () => {
        console.log("options premuto")
    }


    return (
        <View>
            <BackButton onPress={onBackPress}/>


            {isLoading ? (
                <View style={styles.feedbackContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#FFFFFF"
                    />

                    <Text style={styles.feedbackText}>
                        Caricamento torneo...
                    </Text>
                </View>
            ) : error ? (
                <View style={styles.feedbackContainer}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={30}
                        color="#FFFFFF"
                    />

                    <Text style={styles.feedbackText}>
                        {error}
                    </Text>
                </View>
            ) : !tournament ? (
                <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackText}>
                        Torneo non disponibile
                    </Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Picture
                            variant={"tournament"}
                            logoUrl={tournament.logoUrl}
                            style={styles.logo}
                        />
                    </View>

                    <View style={styles.rightContainer}>
                        <View style={styles.nameRow}>

                            <Text
                                style={styles.tournamentName}
                                numberOfLines={1}
                            >
                                {tournament.name}
                            </Text>

                            {canEdit && <SettingsButton onPress={onOptionsPress}/>}


                        </View>

                        <Text
                            style={styles.teamLocation}
                            numberOfLines={1}
                        >
                            {formatLocationLabel(tournament.locationLabel)}
                        </Text>


                        <InviteFriendBadge
                            tournament={tournament}
                            canRefresh={canEdit}
                        />


                    </View>
                </View>
            )}
        </View>
    );
}

type InviteFriendBadgeProps = {
    tournament: TournamentDetails
    canRefresh: boolean
};

function InviteFriendBadge({tournament, canRefresh}: InviteFriendBadgeProps) {

    const [invitationCode, setInvitationCode] = useState(tournament.invitationCode)

    const [copied, setCopied] = useState(false);

    const copiedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    async function copyInvitationCode() {
        try {
            await Clipboard.setStringAsync(invitationCode);

            setCopied(true);

            if (copiedTimeout.current) {
                clearTimeout(copiedTimeout.current);
            }

            copiedTimeout.current = setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch {
            Alert.alert(
                "Copia non riuscita",
                "Non è stato possibile copiare il codice di invito.",
            );
        }

    }


    async function refreshInvitationCode() {
        try {
            const updatedTeam =
                await refreshCodeTournament(tournament.id);

            setInvitationCode(
                updatedTeam.invitationCode,
            );
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

    useEffect(() => {
        setInvitationCode(tournament.invitationCode);
    }, [tournament.invitationCode]);

    return (
        <View style={styles.codeBadge}>

            <Pressable
                onPress={copyInvitationCode}
                style={({pressed}) => [
                    styles.copyArea,
                    pressed && styles.infoBadgePressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Copia codice invito"
            >
                <View style={styles.infoBadgeIcon}>
                    <Ionicons
                        name="copy-outline"
                        size={16}
                        color="#FFFFFF"
                    />
                </View>

                <Text
                    style={styles.infoBadgeText}
                    numberOfLines={1}
                >
                    {copied ? "Copiato!" : invitationCode}
                </Text>
            </Pressable>


            {canRefresh &&
                <Pressable
                    onPress={refreshInvitationCode}
                    style={({pressed}) => [
                        styles.refreshCode,
                        pressed && styles.refreshCodePressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Genera nuovo codice invito"
                >
                    <Ionicons
                        name="refresh"
                        size={18}
                        color="#FFFFFF"
                    />
                </Pressable>
            }
        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 25,
        gap: 25,
    },

    imageContainer: {
        width: 80,
        height: 80,

        borderRadius: 40,
        overflow: "hidden",

        borderWidth: 2.5,
        borderColor: "#FFFFFF",

        backgroundColor: "#D9D9D9",
    },

    rightContainer: {
        flex: 1,
        minWidth: 0,
        justifyContent: "center",
    },

    logo: {
        width: "100%",
        height: "100%",
    },


    teamLocation: {
        marginTop: 3,
        marginBottom: 12,

        color: "rgba(255,255,255,0.78)",
        fontSize: 12,
    },

    codeBadge: {
        flexDirection: "row",
        alignItems: "center",

        height: 38,
        maxWidth: 220,

        paddingLeft: 8,
        paddingRight: 6,

        marginTop: 10,
        marginBottom: 15,

        borderRadius: 12,

        backgroundColor: "rgba(255,255,255,0.18)",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.28)",
    },

    infoBadgePressed: {
        opacity: 0.8,
    },

    copyArea: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 6,

    },

    refreshCode: {
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 60,
        backgroundColor: "rgba(255,255,255,0.4)",
    },

    refreshCodePressed: {
        opacity: 0.8,
    },

    infoBadgeIcon: {
        width: 24,
        height: 24,
        borderRadius: 9,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(255, 255, 255, 0.16)",
    },

    infoBadgeText: {
        flex: 1,
        minWidth: 0,
        flexShrink: 1,

        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "800",
    },


    feedbackContainer: {
        minHeight: 120,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        gap: 10,
    },

    feedbackText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        justifyContent: "space-between",
        minWidth: 0,
    },

    tournamentName: {
        flexShrink: 1,

        color: "#FFFFFF",
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "800",
    },


});