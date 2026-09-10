import {StyleSheet, Text, View} from "react-native";
import {UserEntity} from "@/src/services/users/userService";
import {getRoleBySport, ROLE_LABELS, Sport} from "@/src/services/users/userConstants";
import {router, useSegments} from "expo-router";

import HorizontalCardContainer, {
    roleCardPalettes
} from "@/src/components/common/carousel&cards/HorizontalCardContainer";


type PlayerCardProps = {
    player: UserEntity
    sport: Sport
}

const playerRoutes = {
    teams: "/(app)/teams/player/[profileId]",
    tournaments: "/(app)/tournaments/player/[profileId]",
    profile: "/(app)/profile/[profileId]",
} as const;

function isTabName(value: string): value is keyof typeof playerRoutes {
    return Object.prototype.hasOwnProperty.call(playerRoutes, value);
}

export default function PlayersCard({
                                        player,
                                        sport
                                    }: PlayerCardProps
) {


    const playerRole = getRoleBySport(player, sport);
    const palette = roleCardPalettes[playerRole];

    const segments: readonly string[] = useSegments();


    function handlePress() {
        const appIndex = segments.indexOf("(app)");
        const tab = segments[appIndex + 1];

        if (appIndex === -1 || !tab || !isTabName(tab)) {
            return;
        }

        router.push({
            pathname: playerRoutes[tab],
            params: {
                profileId: String(player.id),
            },
        });
    }

    return (
        <HorizontalCardContainer
            variant="user"
            role={playerRole}
            style={styles.card}
            onPress={handlePress}
        >
            <View style={styles.content}>
                <Text
                    style={[
                        styles.name,
                        {
                            color: palette.title,
                        },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {player.userInfo.firstName + " " + player.userInfo.lastName}
                </Text>

                <View
                    style={[
                        styles.roleBadge,
                        {
                            backgroundColor: palette.badgeBackground,
                            borderColor: palette.badgeBorder,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.roleText,
                            {
                                color: palette.badgeText,
                            },
                        ]}
                        numberOfLines={1}
                    >
                        {ROLE_LABELS[playerRole]}
                    </Text>
                </View>
            </View>
        </HorizontalCardContainer>
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