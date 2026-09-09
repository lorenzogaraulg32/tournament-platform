import {StyleSheet, Text, View} from "react-native";
import {teamCardBlueColors} from "@/src/constants/theme"
import Ionicons from "@expo/vector-icons/Ionicons";
import {router} from "expo-router";
import Picture from "@/src/components/common/images/Picture";
import HorizontalCardContainer from "@/src/components/common/carousel&cards/HorizontalCardContainer";

type TeamCardSmallProps = {
    id: number
    name: string;
    playersCount: number;
    logoUrl?: string;
}


export default function TeamCardHorizontal({
                                               id,
                                               name,
                                               logoUrl,
                                               playersCount,
                                           }: TeamCardSmallProps) {
    function handlePress() {
        router.push({
            pathname: "/teams/[teamId]",
            params: {
                teamId: id,
            },
        })
    }


    return (
        <HorizontalCardContainer
            variant={"team"}
            onPress={handlePress}
        >

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

});

