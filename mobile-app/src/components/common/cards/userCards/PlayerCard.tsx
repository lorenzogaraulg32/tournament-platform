import {StyleSheet, Text, View} from "react-native";
import {getRoleBySport, ROLE_LABELS, Sport, UserInfo} from "@/src/services/users/userDTO";
import {router, useSegments} from "expo-router";

import CardContainerHorizontal from "@/src/components/common/cards/CardContainerHorizontal";
import Ionicons from "@expo/vector-icons/Ionicons";
import {roleCardPalettes} from "@/src/constants/palette/RolePalette";


type PlayerCardProps = {
    player: UserInfo
    sport: Sport
    onPress?: () => void
    icon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
}

const playerRoutes = {
    teams: "/(app)/teams/player/[profileId]",
    tournaments: "/(app)/tournaments/player/[profileId]",
    profile: "/(app)/profile/[profileId]",
} as const;

function isTabName(value: string): value is keyof typeof playerRoutes {
    return Object.prototype.hasOwnProperty.call(playerRoutes, value);
}

export default function PlayerCard({
                                       player,
                                       sport,
                                       onPress,
                                       icon,
                                       iconColor
                                   }: PlayerCardProps
) {


    const playerRole = getRoleBySport(player, sport);
    const rolePalette = roleCardPalettes[playerRole];

    const segments: readonly string[] = useSegments();


    function gotoDetailsPage() {


        const appIndex = segments.indexOf("(app)");
        const tab = segments[appIndex + 1];

        if (appIndex === -1 || !tab || !isTabName(tab)) {
            return;
        }

        router.push({
            pathname: playerRoutes[tab],
            params: {
                profileId: String(player.id),
                back: "1"
            },
        });
    }

    return (
        <CardContainerHorizontal
            variant="player"
            role={playerRole}
            onPress={onPress ? onPress : gotoDetailsPage}
            icon={icon}
            iconColor={iconColor}
        >
            <View style={styles.content}>
                <Text
                    style={[
                        styles.name,
                        {
                            color: rolePalette.title,
                        },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {player.firstName + " " + player.lastName}
                </Text>

                <View
                    style={[
                        styles.roleBadge,
                        {
                            backgroundColor: rolePalette.badgeBackground,
                            borderColor: rolePalette.badgeBorder,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.roleText,
                            {
                                color: rolePalette.badgeText,
                            },
                        ]}
                        numberOfLines={1}
                    >
                        {ROLE_LABELS[playerRole]}
                    </Text>
                </View>
            </View>
        </CardContainerHorizontal>
    );
}

const styles = StyleSheet.create({
    card: {
        position: "relative",
        width: "100%",
        height: 46,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 12,
    },

    content: {
        flex: 1,
        minWidth: 0,

        flexDirection: "row",
        alignItems: "center",
        gap: 9,
    },

    name: {
        flexShrink: 1,

        fontSize: 14,
        lineHeight: 17,
        fontWeight: "800",
        letterSpacing: 0.15,

        textShadowColor: "rgba(0, 0, 0, 0.25)",
        textShadowOffset: {
            width: 0,
            height: 1,
        },
        textShadowRadius: 2,
    },

    roleBadge: {
        flexShrink: 0,

        paddingHorizontal: 9,
        paddingVertical: 3,

        borderRadius: 999,
        borderWidth: 1,
    },

    roleText: {
        fontSize: 10,
        lineHeight: 12,
        fontWeight: "800",
        letterSpacing: 0.2,
    },
});