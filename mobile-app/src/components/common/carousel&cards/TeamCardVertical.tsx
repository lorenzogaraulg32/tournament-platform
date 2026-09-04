import {Pressable, StyleSheet, Text, View} from "react-native";
import {teamCardBlueColors} from "@/src/constants/theme"
import {router} from "expo-router";
import Picture from "@/src/components/common/images/Picture";
import {TeamInfo} from "@/src/services/teams/teamService";

type TeamCardVerticalProps = {
    teamDetails: TeamInfo
}


export default function TeamCardVertical({
                                             teamDetails
                                         }: TeamCardVerticalProps) {
    function handlePress() {
        router.push({
            pathname: "/teams/[teamId]",
            params: {
                teamId: teamDetails.id,
            },
        })
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

        backgroundColor: teamCardBlueColors.background,

        borderRadius: 18,
        borderWidth: 1,
        borderColor: teamCardBlueColors.border,

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

        backgroundColor: teamCardBlueColors.glowLeft,
    },

    glowRight: {
        position: "absolute",
        right: -80,
        bottom: -100,

        width: 210,
        height: 210,
        borderRadius: 105,

        backgroundColor: teamCardBlueColors.glowRight,
    },

    diagonalLineOne: {
        position: "absolute",
        right: 35,
        top: -50,

        width: 12,
        height: 190,

        backgroundColor: teamCardBlueColors.diagonalPrimary,
        transform: [{rotate: "28deg"}],
    },

    diagonalLineTwo: {
        position: "absolute",
        right: 68,
        top: -45,

        width: 4,
        height: 180,

        backgroundColor: teamCardBlueColors.diagonalAccent,
        transform: [{rotate: "28deg"}],
    },

    diagonalLineThree: {
        position: "absolute",
        right: 100,
        top: -45,

        width: 2,
        height: 180,

        backgroundColor: teamCardBlueColors.diagonalSecondary,
        transform: [{rotate: "28deg"}],
    },

    rightBrush: {
        position: "absolute",
        right: -30,
        bottom: -45,

        width: 165,
        height: 85,

        borderRadius: 50,

        backgroundColor: teamCardBlueColors.brush,
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
        color: teamCardBlueColors.title,
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

        backgroundColor: teamCardBlueColors.yellowAccent,
    },

    accentRight: {
        position: "absolute",
        right: 0,
        top: 10,
        height: 42,
        width: 4,

        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,

        backgroundColor: teamCardBlueColors.yellowAccent,
    },
});

