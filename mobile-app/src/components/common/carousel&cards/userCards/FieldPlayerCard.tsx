import {StyleSheet, Text, View} from "react-native";
import {UserInfo} from "@/src/services/users/userService";
import {getRoleBySport, Sport} from "@/src/services/users/userConstants";
import {FieldCardBackground, roleCardPalettes} from "@/src/constants/CardPalettesManager";
import Picture from "@/src/components/common/images/Picture";
import {FieldRole, fieldRoleCardPalettes} from "@/src/components/pagesComponents/teams/field/FieldPaletteManager";


type FieldPlayerCardProps = {
    player: UserInfo
    sport: Sport
    role?: FieldRole
    roleLabel?: string
}


export default function FieldPlayerCard({
                                            player,
                                            sport,
                                            role,
                                            roleLabel
                                        }: FieldPlayerCardProps) {
    const playerRole = getRoleBySport(player, sport);
    const palette = roleCardPalettes[playerRole];
    const roleBadgePalette = role && fieldRoleCardPalettes[role] || null;


    return (
        <View
            style={styles.container}>
            <View style={styles.cardArea}>

                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: palette.background,
                            borderColor: palette.border,
                        },
                    ]}
                >
                    <FieldCardBackground palette={palette}/>
                </View>


                <View
                    style={[styles.logoContainer, {borderColor: palette.border}]}
                >
                    <Picture
                        variant="profile"
                        logoUrl={player.profilePicUrl}
                        style={styles.logo}
                    />
                </View>
                <Text
                    style={[
                        styles.name,
                        {color: palette.title},
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {player.username}
                </Text>
                {role && <Text
                    style={[
                        styles.roleLabel,
                        {
                            color: palette.title,
                            backgroundColor: roleBadgePalette?.background,
                            borderColor: roleBadgePalette?.badgeBorder
                        },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {roleLabel}
                </Text>
                }
            </View>
        </View>
    );
}

const LOGO_SIZE = 46;
const CARD_WIDTH = 72;
const CARD_HEIGHT = 48;

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        alignItems: "center",
        gap: 5,
    },

    cardArea: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT + LOGO_SIZE / 2,
        position: "relative",
    },

    card: {
        position: "absolute",
        top: LOGO_SIZE / 2,
        left: 0,
        right: 0,
        height: CARD_HEIGHT,

        borderWidth: 1,
        borderRadius: 12,
        overflow: "hidden",
    },

    logoContainer: {
        position: "absolute",
        top: 0,
        left: (CARD_WIDTH - LOGO_SIZE) / 2,
        zIndex: 1,

        width: LOGO_SIZE,
        height: LOGO_SIZE,
        borderRadius: LOGO_SIZE / 2,
        borderWidth: 1,
        overflow: "hidden",

        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        width: "100%",
        height: "100%",
        borderRadius: LOGO_SIZE / 2,
    },

    name: {
        position: "absolute",
        bottom: (LOGO_SIZE / 6),
        width: "100%",
        fontSize: 11,
        fontWeight: "700",
        textAlign: "center",

        textShadowColor: "rgba(0, 0, 0, 0.40)",
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
    },

    glassOverlay: {
        ...StyleSheet.absoluteFill,
        borderRadius: 12,
        overflow: "hidden",
    },

    topEdge: {
        position: "absolute",
        top: 0,
        left: 10,
        right: 10,
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.40)",
    },

    leftEdge: {
        position: "absolute",
        top: 10,
        bottom: 10,
        left: 0,
        width: 1,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
    },


    roleLabel: {
        position: "absolute",
        bottom: -25,
        width: "100%",
        fontSize: 11,
        fontWeight: "700",
        textAlign: "center",

        paddingVertical: 2,
        paddingHorizontal: 4,

        textShadowColor: "rgba(0, 0, 0, 0.40)",
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
        borderRadius: 20,
    },
});