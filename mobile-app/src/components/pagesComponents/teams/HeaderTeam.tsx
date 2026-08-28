import {ActivityIndicator, Alert, Pressable, StyleSheet, Text, View,} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Picture from "@/src/components/common/images/Picture";
import {refreshCode, TeamDetails} from "@/src/services/teams/teamService";
import {useEffect, useRef, useState} from "react";
import * as Clipboard from "expo-clipboard";
import {router} from "expo-router";
import {normalizeApiRequestError} from "@/src/services/errorService";

type TeamHeaderProps = {
    team: TeamDetails | null;
    isLoading?: boolean;
    error?: string | null;
    canEdit: boolean;
};


/**
 *
 * @param team la squadra selezionata
 * @param isLoading se la squadra sta caricando
 * @param error se c'è stato un errore nel caricamento della squadra
 * @param onInviteFriendPress
 * @constructor
 */
export default function HeaderTeam({
                                       team,
                                       isLoading = false,
                                       error = null,
                                       canEdit
                                   }: TeamHeaderProps) {


    function formatLocationLabel(location: string): string {
        return location
            .split(",")
            .map(part => part.trim())
            .filter(Boolean)
            .join("  ·  ");
    }

    const onBackPress = () => {
        router.back()
    }


    const onOptionsPress = () => {
        console.log("options premuto")
    }


    return (
        <View>
            <Pressable
                onPress={onBackPress}
                hitSlop={16}
                style={[
                    styles.backButton,
                ]}
            >
                <Ionicons
                    name="chevron-back"
                    size={28}
                    color="#FFFFFF"
                />
            </Pressable>

            {isLoading ? (
                <View style={styles.feedbackContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#FFFFFF"
                    />

                    <Text style={styles.feedbackText}>
                        Caricamento squadra...
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
            ) : !team ? (
                <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackText}>
                        Squadra non disponibile
                    </Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Picture
                            variant={"team"}
                            logoUrl={team.logoUrl}
                            style={styles.logo}
                        />
                    </View>

                    <View style={styles.rightContainer}>
                        <View style={styles.nameRow}>

                            <Text
                                style={styles.teamName}
                                numberOfLines={1}
                            >
                                {team.name}
                            </Text>

                            {canEdit && (
                                <Pressable
                                    onPress={onOptionsPress}
                                    accessibilityRole="button"
                                    accessibilityLabel="Modifica squadra"
                                    hitSlop={10}
                                    style={({pressed}) => [
                                        styles.editButton,
                                        pressed && styles.editButtonPressed,
                                    ]}
                                >
                                    <Ionicons
                                        name="pencil-outline"
                                        size={18}
                                        color="#FFFFFF"
                                    />
                                </Pressable>
                            )}

                        </View>

                        <Text
                            style={styles.teamLocation}
                            numberOfLines={1}
                        >
                            {formatLocationLabel(team.locationLabel)}
                        </Text>


                        <InviteFriendBadge
                            team={team}
                            canRefresh={canEdit}
                        />


                    </View>
                </View>
            )}
        </View>
    );
}

type InviteFriendBadgeProps = {
    team: TeamDetails
    canRefresh: boolean
};

function InviteFriendBadge({team, canRefresh}: InviteFriendBadgeProps) {

    const [invitationCode, setInvitationCode] = useState(team.invitationCode)

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
                await refreshCode(team.id);

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
        setInvitationCode(team.invitationCode);
    }, [team.invitationCode]);

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

    backButton: {
        position: "absolute",

        left: 0,
        zIndex: 10,

        width: 35,
        height: 35,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 18,

        backgroundColor: "rgba(255,255,255,0.14)",

    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,

        minWidth: 0,
    },

    teamName: {
        flexShrink: 1,

        color: "#FFFFFF",
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "800",
    },

    editButton: {
        width: 33,
        height: 33,

        borderRadius: 18,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(255,255,255,0.10)",
    },

    editButtonPressed: {
        backgroundColor: "rgba(255,255,255,0.20)",
        transform: [{scale: 0.94}],
    },


});