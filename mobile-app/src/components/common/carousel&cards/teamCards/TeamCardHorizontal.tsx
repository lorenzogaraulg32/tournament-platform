import {StyleSheet, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {router, useSegments} from "expo-router";
import Picture from "@/src/components/common/images/Picture";
import HorizontalCardContainer from "@/src/components/common/carousel&cards/HorizontalCardContainer";
import {teamCardColors} from "@/src/constants/CardPalettesManager";
import {Media} from "@/src/services/mediaService";
import {Sport, SPORT_LABELS} from "@/src/services/sportDTO";
import {BadgePalette, rolePaletteMapper} from "@/src/constants/BadgePaletteManager";

type TeamCardSmallProps = {
    id: string
    name: string;
    playersCount: number;
    image: Media | null;
    sport?: Sport;
    modify?: () => void
}

const teamRoutes = {
    teams: "/(app)/teams/[teamId]",
    tournaments: "/(app)/tournaments/team/[teamId]",
    profile: "/(app)/profile/team/[teamId]",
} as const;

function isTabName(value: string): value is keyof typeof teamRoutes {
    return Object.prototype.hasOwnProperty.call(teamRoutes, value);
}


export default function TeamCardHorizontal({
                                               id,
                                               name,
                                               image,
                                               sport,
                                               playersCount,
                                               modify
                                           }: TeamCardSmallProps) {


    const segments: readonly string[] = useSegments();

    const palette: BadgePalette | null = sport ? rolePaletteMapper[sport] : null
    const sportLabel= sport ? SPORT_LABELS[sport] : null

    function handlePress() {

        if (modify) {
            modify();
            return;
        }

        const appIndex = segments.indexOf("(app)");
        const tab = segments[appIndex + 1];

        if (appIndex === -1 || !tab || !isTabName(tab)) {
            return;
        }

        router.push({
            pathname: teamRoutes[tab],
            params: {
                teamId: String(id),
            },
        });
    }


    return (
        <HorizontalCardContainer
            variant={"team"}
            onPress={handlePress}
            modify={modify ? modify : undefined}
            showArrow
        >

            <View style={styles.logoContainer}>
                <Picture variant={"teams"} style={styles.logo} image={image}/>
            </View>

            <View style={styles.teamInfo}>
                <Text
                    style={styles.teamName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {name}
                </Text>

                <View style={styles.playersRow}>
                    <Ionicons
                        name="people-outline"
                        size={11}
                        color="#A9C7B5"
                    />

                    <Text style={styles.playersText}>
                        {playersCount}{" "}
                        {playersCount === 1 ? "giocatore" : "giocatori"}
                    </Text>
                </View>
            </View>

            {sport &&
                <View style={[styles.sportBadge,
                    {
                        backgroundColor: palette?.backgroundColor,
                        borderColor: palette?.borderColor
                    }]}>
                    <Text
                        style={[styles.sportBadgeText, {color: palette?.textColor}]}>{sportLabel}</Text>
                </View>
            }


        </HorizontalCardContainer>
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
        fontSize: 14,
        lineHeight: 16,
        fontWeight: "800",
        letterSpacing: 0.2,
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
        marginRight: 10,
        paddingVertical: 4,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderRadius: 99,
    },

    sportBadgeText: {
        fontSize: 11
    }


});

