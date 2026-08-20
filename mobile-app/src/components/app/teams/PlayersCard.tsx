import {StyleSheet, Text, View} from "react-native";
import Picture from "@/src/components/common/Picture";
import {colors, teamCardBlueColors} from "@/src/constants/theme";
import { UserEntity} from "@/src/services/users/userService";
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

    const role = playerRole
        ? ROLE_LABELS[playerRole]
        : "Jolly";


    return (
        <View style={styles.container}>
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
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: 85,
        width: 62,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#D0EBDD",
        gap: 3,
    },


    logoContainer: {
        width: 36,
        height: 36,
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
        fontSize: 9,
        fontWeight: 500
    },

    ruolo: {
        fontSize: 10,
        fontWeight: "bold",
        color: colors.textLightGreen
    }


})
