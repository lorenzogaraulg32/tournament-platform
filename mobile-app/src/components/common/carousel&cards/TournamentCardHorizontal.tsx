import {StyleSheet, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Picture from "@/src/components/common/images/Picture";
import HorizontalCardContainer from "@/src/components/common/carousel&cards/HorizontalCardContainer";
import {TournamentStatus} from "@/src/services/tournaments/tournamentsDTO";
import {router, useSegments} from "expo-router";
import {tournamentCardColors} from "@/src/constants/cardPalettes";

type TournamentCardHorizontalProps = {
    id: number
    name: string;
    teamsCount: number;
    logoUrl?: string;
    status: TournamentStatus;
}

const tournamentRoutes = {
    teams: "/(app)/teams/tournament/[tournamentId]",
    profile: "/(app)/profile/tournament/[tournamentId]",
    tournaments: "/(app)/tournaments/[tournamentId]",
} as const;

function isTabName(
    value: string
): value is keyof typeof tournamentRoutes {
    return Object.prototype.hasOwnProperty.call(tournamentRoutes, value);
}


export default function TournamentCardHorizontal({
                                                     id,
                                                     name,
                                                     logoUrl,
                                                     teamsCount,
                                                     status
                                                 }: TournamentCardHorizontalProps) {

    const segments: readonly string[] = useSegments();

    function handlePress() {
        const appIndex = segments.indexOf("(app)");

        if (appIndex === -1) {
            return;
        }

        const tab = segments[appIndex + 1];

        if (!tab || !isTabName(tab)) {
            return;
        }

        router.push({
            pathname: tournamentRoutes[tab],
            params: {
                tournamentId: String(id),
            },
        });
    }


    return (
        <HorizontalCardContainer
            variant={"tournament"}
            onPress={handlePress}
        >

            <View style={styles.logoContainer}>
                <Picture variant={"tournament"} style={styles.logo} logoUrl={logoUrl}/>
            </View>

            <View style={styles.tournamentInfo}>
                <View>
                    <Text
                        style={styles.tournamentName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {name}
                    </Text>

                    <View style={styles.teamsRow}>
                        <Ionicons
                            name="people-outline"
                            size={11}
                            color="#A9C7B5"
                        />

                        <Text style={styles.teamsText}>
                            {teamsCount}{" "}
                            {teamsCount === 1 ? "squadra" : "squadre"}
                        </Text>
                    </View>
                </View>

                <TournamentStatusBadge status={status as TournamentStatus}/>
            </View>


        </HorizontalCardContainer>
    );
}


type TournamentStatusBadgeProps = {
    status: TournamentStatus;
}

type LabelAndColorContainer = {
    label: string,
    bkColor: string,
    textColor: string,
}

const statusLabelAndColor: Record<TournamentStatus, LabelAndColorContainer> = {
    CREATED: {
        label: "CREATO",
        bkColor: "#E0F2FE",
        textColor: "#0369A1",
    },

    REG_OPEN: {
        label: "APERTO",
        bkColor: "#DCFCE7",
        textColor: "#15803D",
    },

    REP_CLOSED: {
        label: "CHIUSO",
        bkColor: "#F3F4F6",
        textColor: "#4B5563",
    },

    DRAFTING_MATCHES: {
        label: "DRAFTING",
        bkColor: "#FEF9C3",
        textColor: "#A16207",
    },

    IN_PROGRESS: {
        label: "IN CORSO",
        bkColor: "#E0E7FF",
        textColor: "#4338CA",
    },

    ENDED: {
        label: "TERMINATO",
        bkColor: "#FEE2E2",
        textColor: "#B91C1C",
    },

    COMPLETED: {
        label: "COMPLETATO",
        bkColor: "#F0FDF4",
        textColor: "#166534",
    },

    CANCELLED: {
        label: "CANCELLATO",
        bkColor: "#F5F5F5",
        textColor: "#737373",
    },
}


const fallbackConfig: LabelAndColorContainer = {
    label: "SCONOSCIUTO",
    bkColor: "#E5E7EB",
    textColor: "#374151"
};

function TournamentStatusBadge({status}: TournamentStatusBadgeProps) {

    const config = statusLabelAndColor[status] || fallbackConfig;

    return (
        <View style={[styles.badgeContainer, {backgroundColor: config.bkColor}]}
        >
            <Text style={[styles.statusBadge, {color: config.textColor}]}>{config.label}</Text>
        </View>
    )
}


const styles = StyleSheet.create({


    logoContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: tournamentCardColors.logoBackground,
        borderColor: tournamentCardColors.logoBorder,

        borderWidth: 1,
    },


    logo: {
        width: "100%",
        height: "100%",
        borderRadius: 17,
    },

    tournamentInfo: {
        flex: 1,
        justifyContent: "space-between",
        marginLeft: 10,
        flexDirection: "row",

    },


    tournamentName: {
        color: tournamentCardColors.title,
        fontSize: 14,
        lineHeight: 16,
        fontWeight: "800",
        letterSpacing: 0.2,

    },

    teamsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
        gap: 4,

    },

    teamsText: {
        color: tournamentCardColors.secondaryText,
        fontSize: 10,
        lineHeight: 12,
        fontWeight: "500",
    },


    badgeContainer: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
        marginRight: 10,
    },

    statusBadge: {
        fontSize: 10,
        fontWeight: "600",
    },
});

