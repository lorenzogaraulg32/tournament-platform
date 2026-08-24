import {Pressable, StyleSheet, Text, View} from "react-native";
import Picture from "@/src/components/common/images/Picture";
import {colors, teamCardBlueColors, teamCardGreenColors} from "@/src/constants/theme";
import {UserEntity} from "@/src/services/users/userService";
import {TeamDetails} from "@/src/services/teams/teamService";

type AdminsCardProps = {
    admin: UserEntity
    team: TeamDetails
}


export default function AdminsCard({
                                       admin,
                                       team
                                   }: AdminsCardProps
) {

    const profilePicUrl = admin.userInfo.profilePicUrl
    const name = admin.userInfo.username
    const role = team.creatorId === admin.id ? "Owner" : "Admin"


    function handlePress() {
        //TODO
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
            <View style={styles.userInfoContainer}>
                <Text
                    numberOfLines={1}
                    style={styles.name}>
                    {name}
                </Text>

                <View style={styles.roleBadgeContainer}>
                    <Text style={styles.ruolo}>{role ? (role) : ("OWNER")}</Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({

    card: {
        justifyContent: "space-evenly",
        flexDirection: "row",
        alignItems: "center",

        height: 70,
        width: 120,

        borderRadius: 18,
        borderWidth: 1,
        borderColor: teamCardGreenColors.border,

        backgroundColor: teamCardGreenColors.background,

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
        width: 40,
        height: 40,
        borderRadius: 20,

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
        color:  "#41800a",
        textShadowColor:   "rgba(75,145,11,0.18)",
        textShadowOffset:{
            height: 1,
            width: 0
        },
        textShadowRadius: 2,
    },

    userInfoContainer: {
        height: "100%",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,

    },
    roleBadgeContainer: {
        backgroundColor: "#ffffff",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderColor: colors.textLightGreen,
        borderWidth: 1,
        borderRadius: 50
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
