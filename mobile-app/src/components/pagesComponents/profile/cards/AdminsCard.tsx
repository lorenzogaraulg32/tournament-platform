import {StyleSheet, Text, View} from "react-native";
import {router, useSegments} from "expo-router";

import HorizontalCardContainer, {
    authorityCardPalettes,
    TeamAuthority
} from "@/src/components/common/carousel&cards/HorizontalCardContainer";

import {UserEntity} from "@/src/services/users/userService";


type AdminsCardProps = {
    admin: UserEntity;
    isOwner: boolean;
};

const adminRoutes = {
    teams: "/(app)/teams/player/[profileId]",
    tournaments: "/(app)/tournaments/player/[profileId]",
    profile: "/(app)/profile/[profileId]",
} as const;

function isTabName(value: string): value is keyof typeof adminRoutes {
    return Object.prototype.hasOwnProperty.call(adminRoutes, value);
}

export default function AdminsCard({
                                       admin,
                                       isOwner,
                                   }: AdminsCardProps) {
    const authority: TeamAuthority = isOwner ? "OWNER" : "ADMIN";
    const palette = authorityCardPalettes[authority];

    const segments: readonly string[] = useSegments();


    function handlePress() {
        const appIndex = segments.indexOf("(app)");
        const tab = segments[appIndex + 1];

        if (appIndex === -1 || !tab || !isTabName(tab)) {
            return;
        }

        router.push({
            pathname: adminRoutes[tab],
            params: {
                profileId: String(admin.id),
            },
        });
    }

    return (
        <HorizontalCardContainer
            variant="authority"
            authority={authority}
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
                    {admin.userInfo.firstName + " " + admin.userInfo.lastName}
                </Text>

                <View
                    style={[
                        styles.authorityBadge,
                        {
                            backgroundColor:
                            palette.badgeBackground,
                            borderColor:
                            palette.badgeBorder,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.authorityText,
                            {
                                color: palette.badgeText,
                            },
                        ]}
                        numberOfLines={1}
                    >
                        {authority}
                    </Text>
                </View>
            </View>
        </HorizontalCardContainer>
    );
}

const styles = StyleSheet.create({
    card: {
        position: "relative",
        flex: 1,
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

    authorityBadge: {
        flexShrink: 0,

        paddingHorizontal: 9,
        paddingVertical: 3,

        borderRadius: 999,
        borderWidth: 1,
    },

    authorityText: {
        fontSize: 10,
        lineHeight: 12,
        fontWeight: "800",
        letterSpacing: 0.3,
    },
});