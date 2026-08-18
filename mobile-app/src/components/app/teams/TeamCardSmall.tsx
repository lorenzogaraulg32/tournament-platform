import {Pressable, StyleSheet, Text, View} from "react-native";
import {teamCardBlueColors} from "@/src/constants/theme"
import Ionicons from "@expo/vector-icons/Ionicons";
import {router} from "expo-router";
import Picture from "@/src/components/common/Picture";

type TeamCardSmallProps = {
    id: number
    name: string;
    playersCount: number;
    logoUrl?: string;
}


export default function TeamCardSmall({
                                          id,
                                          name,
                                          logoUrl,
                                          playersCount,
                                      }: TeamCardSmallProps) {
    async function handlePress() {
        router.push({
            pathname: "/teams/[teamId]",
            params: {
                teamId: id,
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

            <View style={styles.accentLine}/>

            <View style={styles.logoContainer}>
                <Picture variant={"team"} style={styles.logo} logoUrl={logoUrl}/>
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

            <View style={styles.arrowContainer}>
                <Ionicons
                    name="chevron-forward"
                    size={17}
                    color="#FFD54A"
                />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        position: "relative",
        width: "100%",
        height: 56,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 12,

        backgroundColor: "#071D35",

        borderRadius: 16,
        borderWidth: 1,
        borderColor: teamCardBlueColors.border,

        overflow: "hidden",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.16,
        shadowRadius: 6,
        elevation: 4,
    },

    cardPressed: {
        opacity: 0.9,
        transform: [{scale: 0.985}],
    },

    background: {
        ...StyleSheet.absoluteFillObject,
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

    accentLine: {
        position: "absolute",
        left: 0,
        top: 20,
        bottom: 20,

        width: 4,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,

        backgroundColor: teamCardBlueColors.yellowAccent,
    },

    logoContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: teamCardBlueColors.logoBackground,
        borderColor: teamCardBlueColors.logoBorder,

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
        color: teamCardBlueColors.title,
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
        color: teamCardBlueColors.secondaryText,
        fontSize: 10,
        lineHeight: 12,
        fontWeight: "500",
    },

    arrowContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,

        marginLeft: 8,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: teamCardBlueColors.yellowBackground,
    },
});

