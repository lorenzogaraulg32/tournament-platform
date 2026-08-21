import {Pressable, StyleSheet, Text, View} from "react-native";
import Picture from "@/src/components/common/Picture";
import {colors, teamCardBlueColors, teamCardGreenColors} from "@/src/constants/theme";
import {UserEntity} from "@/src/services/users/userService";
import {ROLE_LABELS, Sport, SportRole} from "@/src/services/users/userConstants";


type PlayerCardProps = {
    player: UserEntity
    sport: Sport
}


export default function PlayersCard({
                                        player,
                                        sport
                                    }: PlayerCardProps
) {

    function getRoleBySport(
        player: UserEntity,
        sport: Sport
    ): SportRole | undefined {
        return player.userInfo.roles.find(
            item => item.sport === sport
        )?.role;
    }

    const profilePicUrl = player.userInfo.profilePicUrl
    const name = player.userInfo.username
    const playerRole = getRoleBySport(player, sport);

    const role = playerRole ? ROLE_LABELS[playerRole] : "Jolly";

    function handlePress() {

    }

    return (
        <Pressable
            style={({pressed}) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
            onPress={handlePress}>

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
                <Picture
                    variant={"player"}
                    style={styles.logo}
                    logoUrl={profilePicUrl}/>
            </View>
            <Text
                numberOfLines={1}
                style={styles.name}>
                {name}
            </Text>

            <Text style={styles.ruolo}>{role}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({

    card: {
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",

        height: 85,
        width: 62,

        backgroundColor: teamCardGreenColors.background,

        borderRadius: 18,
        borderWidth: 1,
        borderColor: teamCardGreenColors.border,

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


    logoContainer: {
        width: 36,
        height: 36,
        borderRadius: 20,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: teamCardGreenColors.logoBackground,
        borderColor: teamCardGreenColors.logoBorder,

        borderWidth: 1,
    },


    logo: {
        width: "100%",
        height: "100%",
        borderRadius: 17,
    },

    name: {
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        textShadowColor:   "rgba(0,0,0,0.29)",
        textShadowOffset:{
            height: 2,
            width: 0
        },
        textShadowRadius: 2,
    },

    ruolo: {
        fontSize: 10,
        fontWeight: "bold",
        color: colors.textLightGreen,
        textShadowColor:   "rgba(141,192,12,0.38)",
        textShadowOffset:{
            height: 2,
            width: 0
        },
        textShadowRadius: 2,
    },

    background: {
        ...StyleSheet.absoluteFillObject,
        overflow: "hidden",
        borderRadius: 15,
    },

    glowLeft: {
        position: "absolute",
        left: -65,
        top: -55,

        width: 170,
        height: 170,
        borderRadius: 85,

        backgroundColor: teamCardGreenColors.glowLeft,
    },

    glowRight: {
        position: "absolute",
        right: -80,
        bottom: -100,

        width: 210,
        height: 210,
        borderRadius: 105,

        backgroundColor: teamCardGreenColors.glowRight,
    },

    diagonalLineOne: {
        position: "absolute",
        right: 35,
        top: -50,

        width: 12,
        height: 190,

        backgroundColor: teamCardGreenColors.diagonalPrimary,
        transform: [{rotate: "28deg"}],
    },

    diagonalLineTwo: {
        position: "absolute",
        right: 68,
        top: -45,

        width: 4,
        height: 180,

        backgroundColor: teamCardGreenColors.diagonalAccent,
        transform: [{rotate: "28deg"}],
    },

    diagonalLineThree: {
        position: "absolute",
        right: 100,
        top: -45,

        width: 2,
        height: 180,

        backgroundColor: teamCardGreenColors.diagonalSecondary,
        transform: [{rotate: "28deg"}],
    },

    rightBrush: {
        position: "absolute",
        right: -30,
        bottom: -45,

        width: 165,
        height: 85,

        borderRadius: 50,

        backgroundColor: teamCardGreenColors.brush,
        transform: [
            {rotate: "-12deg"},
            {scaleX: 1.3},
        ],
    },


    accentLeft: {
        position: "absolute",
        left: 0,
        top: 10,
        height: 42,
        width: 4,

        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,

        backgroundColor: teamCardGreenColors.accent,
    },

    accentRight: {
        position: "absolute",
        right: 0,
        top: 10,
        height: 42,
        width: 4,

        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,

        backgroundColor: teamCardGreenColors.accent,
    },

})
