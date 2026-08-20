import {StyleSheet, Text, View} from "react-native";
import Picture from "@/src/components/common/Picture";
import {colors, teamCardBlueColors} from "@/src/constants/theme";
import {UserEntity} from "@/src/services/users/userService";
import {TeamDetails} from "@/src/services/teams/teamGetService";

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


    return (
        <View style={styles.container}>
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
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        justifyContent: "space-evenly",
        flexDirection: "row",
        alignItems: "center",
        height: 65,
        width: 106,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#D0EBDD",

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
        fontSize: 10,
        fontWeight: 500
    },

    ruolo: {
        fontSize: 10,
        fontWeight: "bold",
        color: colors.textLightGreen
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
    }


})
