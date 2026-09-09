import {StyleSheet, Text, View} from "react-native";
import {TournamentStatus} from "@/src/services/tournaments/tournamentsDTO";



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

export default function TournamentStatusBadge({status}: TournamentStatusBadgeProps) {





    const config = statusLabelAndColor[status] || fallbackConfig;

    return (
        <View style={[styles.badgeContainer, {backgroundColor: config.bkColor}]}
              >
            <Text style={[styles.statusBadge, {color: config.textColor}]}>{config.label}</Text>
        </View>
    )
}


const styles = StyleSheet.create({

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
})