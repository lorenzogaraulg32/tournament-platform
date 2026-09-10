import {Pressable, StyleSheet, Text, View} from "react-native";
import {router, useSegments} from "expo-router";
import Picture from "@/src/components/common/images/Picture";
import {TeamInfo} from "@/src/services/teams/teamService";
import {teamCardColors} from "@/src/constants/cardPalettes";

type TeamCardVerticalProps = {
    teamDetails: TeamInfo
}

const teamRoutes = {
    teams: "/(app)/teams/[teamId]",
    tournaments: "/(app)/tournaments/team/[teamId]",
    profile: "/(app)/profile/team/[teamId]",
} as const;

function isTabName(value: string): value is keyof typeof teamRoutes {
    return Object.prototype.hasOwnProperty.call(teamRoutes, value);
}


export default function TeamCardVertical({
                                             teamDetails
                                         }: TeamCardVerticalProps) {
    const segments: readonly string[] = useSegments();


    function handlePress() {
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
        <Pressable
            style={({pressed}) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
            onPress={handlePress}
        >
            <View pointerEvents="none" style={styles.background}>
                <View style={styles.glowLeft}/>
                <View style={styles.glowRight}/>
                <View style={styles.diagonalLineOne}/>
                <View style={styles.diagonalLineTwo}/>
                <View style={styles.diagonalLineThree}/>
                <View style={styles.rightBrush}/>
            </View>

            <View pointerEvents="none" style={styles.accentLeft}/>
            <View pointerEvents="none" style={styles.accentRight}/>


            <View style={styles.logoContainer}>
                <Picture variant={"team"} style={styles.logo} logoUrl={teamDetails.logoUrl}/>
            </View>

            <View style={styles.teamInfo}>
                <Text
                    style={styles.teamName}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {teamDetails.name}
                </Text>

            </View>

        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        position: "relative",

        alignItems: "center",
        justifyContent: "space-between",

        width: 90,
        height: 95,
        gap: 3,

        paddingTop: 10,
        paddingBottom: 5,
        paddingHorizontal: 7,

        backgroundColor: teamCardColors.background,

        borderRadius: 18,
        borderWidth: 1,
        borderColor: teamCardColors.border,

        overflow: "hidden",

        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 3,
    },

    cardPressed: {
        opacity: 0.9,
        transform: [{scale: 0.985}],
    },

    background: {
        ...StyleSheet.absoluteFill,
        overflow: "hidden",
    },

    glowLeft: {
        position: "absolute",
        left: -65,
        top: -55,

        width: 170,
        height: 170,
        borderRadius: 85,

        backgroundColor: teamCardColors.glowLeft,
    },

    glowRight: {
        position: "absolute",
        right: -80,
        bottom: -100,

        width: 210,
        height: 210,
        borderRadius: 105,

        backgroundColor: teamCardColors.glowRight,
    },

    diagonalLineOne: {
        position: "absolute",
        right: 35,
        top: -50,

        width: 12,
        height: 190,

        backgroundColor: teamCardColors.diagonalPrimary,
        transform: [{rotate: "28deg"}],
    },

    diagonalLineTwo: {
        position: "absolute",
        right: 68,
        top: -45,

        width: 4,
        height: 180,

        backgroundColor: teamCardColors.diagonalAccent,
        transform: [{rotate: "28deg"}],
    },

    diagonalLineThree: {
        position: "absolute",
        right: 100,
        top: -45,

        width: 2,
        height: 180,

        backgroundColor: teamCardColors.diagonalSecondary,
        transform: [{rotate: "28deg"}],
    },

    rightBrush: {
        position: "absolute",
        right: -30,
        bottom: -45,

        width: 165,
        height: 85,

        borderRadius: 50,

        backgroundColor: teamCardColors.brush,
        transform: [
            {rotate: "-12deg"},
            {scaleX: 1.3},
        ],
    },


    logoContainer: {
        width: 44,
        height: 44,
        borderRadius: 28,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#FFFFFF",

        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.7)",
    },

    logo: {
        width: "100%",
        height: "100%",
        borderRadius: 28,
    },

    teamInfo: {
        width: "100%",
        minHeight: 30,
        justifyContent: "center",
        alignItems: "center",
    },

    teamName: {
        color: teamCardColors.title,
        fontSize: 12,
        lineHeight: 13,
        fontWeight: "800",
        textAlign: "center",
    },

    accentLeft: {
        position: "absolute",
        left: 0,
        top: 10,
        height: 42,
        width: 4,

        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,

        backgroundColor: teamCardColors.accent,
    },

    accentRight: {
        position: "absolute",
        right: 0,
        top: 10,
        height: 42,
        width: 4,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        backgroundColor: teamCardColors.accent,
    },
});

