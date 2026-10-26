import {StyleSheet, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {router, useSegments} from "expo-router";
import Picture from "@/src/components/common/images/Picture";
import CardContainerHorizontal from "@/src/components/common/cards/CardContainerHorizontal";
import {teamCardColors} from "@/src/constants/palette/CardPalettesManager";
import {SPORT_LABELS} from "@/src/services/sportDTO";
import {BadgePalette, rolePaletteMapper} from "@/src/constants/palette/BadgePaletteManager";
import {TeamDetails} from "@/src/services/teams/teamDTO";


const teamRoutes = {
    teams: "/(app)/teams/[teamId]",
    tournaments: "/(app)/tournaments/team/[teamId]",
    profile: "/(app)/profile/team/[teamId]",
} as const;

function isTabName(value: string): value is keyof typeof teamRoutes {
    return Object.prototype.hasOwnProperty.call(teamRoutes, value);
}


type TeamCardSmallProps = {
    teamDetails: TeamDetails

    // Funzione di pressione, se non è specificata il comportamento di default è il redirect al dettaglio del team
    onPress?: () => void;

    //Queste proprietà vengono poi passate al container, vengono modificate dall'esterno
    icon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
}

export default function TeamCardHorizontal({
                                               teamDetails,
                                               onPress,
                                               icon,
                                               iconColor,
                                           }: TeamCardSmallProps) {

    // useSegments() è un hook di react che ci permette di conoscere la posizione attuale dell'utente nel sistema di navigazione
    const segments: readonly string[] = useSegments();

    const rolePalette: BadgePalette = rolePaletteMapper[teamDetails.sport]
    const sportLabel = SPORT_LABELS[teamDetails.sport]

    // Pressione standard della card è il redirect alla pagina di dettaglio
    function gotoDetailsPage() {
        const appIndex = segments.indexOf("(app)");
        const tab = segments[appIndex + 1];

        if (appIndex === -1 || !tab || !isTabName(tab)) {
            return;
        }

        router.push({
            pathname: teamRoutes[tab],
            params: {
                teamId: String(teamDetails.id),
            },
        });
    }


    return (
        <CardContainerHorizontal
            variant={"team"}
            onPress={onPress ? onPress : gotoDetailsPage}
            icon={icon}
            iconColor={iconColor}
        >

            <View style={styles.logoContainer}>
                <Picture variant={"teams"} style={styles.logo} image={teamDetails.logo}/>
            </View>

            <View style={styles.teamInfo}>
                <Text
                    style={styles.teamName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >

                    {teamDetails.name}
                </Text>

                <View style={styles.playersRow}>
                    <Ionicons
                        name="people-outline"
                        size={11}
                        color="#A9C7B5"
                    />

                    <Text style={styles.playersText}>
                        {teamDetails.playerIds.length}{" "}
                        {teamDetails.playerIds.length === 1 ? "giocatore" : "giocatori"}
                    </Text>
                </View>
            </View>


            <View style={[styles.sportBadge,
                {
                    backgroundColor: rolePalette.backgroundColor,
                    borderColor: rolePalette.borderColor
                }]}>
                <Text
                    style={[styles.sportBadgeText, {color: rolePalette.textColor}]}>{sportLabel}</Text>
            </View>


        </CardContainerHorizontal>
    );
}


const styles = StyleSheet.create({

    logoContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: teamCardColors.logoBackground,
        borderColor: teamCardColors.logoBorder,

        borderWidth: 1,
    },


    logo: {
        width: "100%",
        height: "100%",
        borderRadius: 17,
    },

    teamInfo: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 10,
    },

    teamName: {
        color: teamCardColors.title,
        fontSize: 13,
        lineHeight: 16,
        fontWeight: "800",
        letterSpacing: 0.2,
        borderColor: "#fff",
        marginRight: 5,
    },

    playersRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
        gap: 4,
    },

    playersText: {
        color: teamCardColors.secondaryText,
        fontSize: 10,
        lineHeight: 12,
        fontWeight: "500",
    },

    sportBadge: {
        paddingVertical: 4,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderRadius: 99,
    },

    sportBadgeText: {
        fontSize: 10
    }


});

