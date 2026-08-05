import {ActivityIndicator, Pressable, StyleSheet, Text, View,} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import HeaderEntity from "../../common/headers/HeaderEntity";
import TeamLogo from "@/src/components/common/logo/TeamLogo";
import type {TeamDetails} from "@/src/services/teams/teamGetService";

type TeamHeaderProps = {
    team: TeamDetails | null;
    isLoading?: boolean;
    error?: string | null;
    onPlayersPress: () => void;
    onAdminsPress: () => void;
};

const TEAM_BACKGROUND = require("../../../../assets/images/teaminfoSectionBkg.png");


/**
 *
 * @param team la squadra selezionata
 * @param isLoading se la squadra sta caricando
 * @param error se c'è stato un errore nel caricamento della squadra
 * @param onPlayersPress
 * @param onAdminsPress
 * @constructor
 */
export default function TeamHeader({
                                       team,
                                       isLoading = false,
                                       error = null,
                                       onPlayersPress,
                                       onAdminsPress,
                                   }: TeamHeaderProps) {

    const playersCount = team ? (team.playerIds?.length ?? 0) : 0;
    const adminsCount = team ? (team.adminIds?.length ?? 0) : 0;

    return (
        <HeaderEntity
            backgroundSource={TEAM_BACKGROUND}
            overlayColor="rgba(31, 10, 2, 0.25)"
            borderColor="rgba(255, 154, 72, 0.25)"
        >
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
                <View style={styles.dataContainer}>
                    <View style={styles.imageContainer}>
                        <TeamLogo
                            logoUrl={team.logoUrl}
                            style={styles.logo}
                        />
                    </View>

                    <View style={styles.verticalSeparator}/>

                    <View style={styles.textContainer}>
                        <Text
                            style={styles.teamName}
                            numberOfLines={2}
                        >
                            {team.name.toUpperCase()}
                        </Text>

                        <View style={styles.badgesContainer}>

                            <InfoBadge
                                icon="shield-checkmark"
                                label={`${adminsCount} ${
                                    adminsCount === 1
                                        ? "Admin"
                                        : "Admin"
                                }`}
                                onPress={onAdminsPress}
                            />


                            <InfoBadge
                                icon="people"
                                label={`${playersCount} ${
                                    playersCount === 1
                                        ? "Giocatore"
                                        : "Giocatori"
                                }`}
                                onPress={onPlayersPress}
                            />


                        </View>
                    </View>
                </View>
            )}
        </HeaderEntity>
    );
}

type InfoBadgeProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
};

function InfoBadge({
                       icon,
                       label,
                       onPress,
                   }: InfoBadgeProps) {
    return (
        <Pressable
            onPress={onPress}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel={`Apri ${label}`}
            style={({pressed}) => [
                styles.infoBadge,
                pressed && styles.infoBadgePressed,
            ]}
        >
            <View style={styles.infoBadgeIcon}>
                <Ionicons
                    name={icon}
                    size={16}
                    color="#FFFFFF"
                />
            </View>

            <Text
                style={styles.infoBadgeText}
                numberOfLines={1}
            >
                {label}
            </Text>

            <View style={styles.infoBadgeArrow}>
                <Ionicons
                    name="chevron-forward"
                    size={14}
                    color="#FFFFFF"
                />
            </View>
        </Pressable>
    );
}


const styles = StyleSheet.create({
    dataContainer: {
        minHeight: 128,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 18,
    },

    imageContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        overflow: "hidden",

        borderWidth: 3,
        borderColor: "#FFFFFF",
        backgroundColor: "#D9D9D9",
    },

    logo: {
        width: "100%",
        height: "100%",
    },

    verticalSeparator: {
        width: 1,
        height: 76,
        marginHorizontal: 18,
        backgroundColor: "rgba(255, 255, 255, 0.24)",
    },

    textContainer: {
        flex: 1,
        minWidth: 0,
        justifyContent: "center",
    },

    teamName: {
        color: "#FFFFFF",
        fontSize: 22,
        lineHeight: 27,
        fontWeight: "800",
        letterSpacing: 0.2,
    },

    badgesContainer: {
        marginTop: 14,
        gap: 8,
    },

    infoBadge: {
        minWidth: 0,
        flexDirection: "row",
        alignItems: "center",

        paddingLeft: 8,
        paddingRight: 7,
        paddingVertical: 8,

        borderRadius: 14,
        gap: 7,

        backgroundColor: "rgba(255, 255, 255, 0.40)",

        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.38)",

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.12,
        shadowRadius: 3,

        elevation: 2,
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

    infoBadgeArrow: {
        width: 20,
        height: 20,
        borderRadius: 10,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(255, 255, 255, 0.16)",
    },

    infoBadgePressed: {
        opacity: 0.78,
        transform: [{scale: 0.97}],
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
});