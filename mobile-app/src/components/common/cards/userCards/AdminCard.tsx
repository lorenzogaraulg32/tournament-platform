import {StyleSheet, Text, View} from "react-native";
import {router, useSegments} from "expo-router";


import {UserInfo} from "@/src/services/users/userDTO";
import {Authority, authorityCardPalettes} from "@/src/constants/palette/CardPalettesManager";
import CardContainerHorizontal from "@/src/components/common/cards/CardContainerHorizontal";
import Ionicons from "@expo/vector-icons/Ionicons";


type AdminsCardProps = {
    admin: UserInfo;
    isOwner: boolean;
    onPress?: () => void
    icon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
};

const adminRoutes = {
    teams: "/(app)/teams/player/[profileId]",
    tournaments: "/(app)/tournaments/player/[profileId]",
    profile: "/(app)/profile/[profileId]",
} as const;

function isTabName(value: string): value is keyof typeof adminRoutes {
    return Object.prototype.hasOwnProperty.call(adminRoutes, value);
}

export default function AdminCard({
                                      admin,
                                      isOwner,
                                      onPress,
                                      icon,
                                      iconColor
                                  }: AdminsCardProps) {
    const authority: Authority = isOwner ? "OWNER" : "ADMIN";
    const palette = authorityCardPalettes[authority];

    const segments: readonly string[] = useSegments();


    function gotoDetailsPage() {

        const appIndex = segments.indexOf("(app)");
        const tab = segments[appIndex + 1];

        if (appIndex === -1 || !tab || !isTabName(tab)) {
            return;
        }

        router.push({
            pathname: adminRoutes[tab],
            params: {
                profileId: String(admin.id),
                back: "1"
            },
        });
    }

    return (
        <CardContainerHorizontal
            variant="authority"
            authority={authority}
            onPress={onPress ? onPress : gotoDetailsPage}
            icon={icon}
            iconColor={iconColor}
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
                    {admin.firstName + " " + admin.lastName}
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
        </CardContainerHorizontal>
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