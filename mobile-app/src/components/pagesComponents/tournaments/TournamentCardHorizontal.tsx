import {StyleSheet, Text, View} from "react-native";
import {teamCardBlueColors} from "@/src/constants/theme"
import Ionicons from "@expo/vector-icons/Ionicons";
import Picture from "@/src/components/common/images/Picture";
import HorizontalCardContainer from "@/src/components/common/carousel&cards/HorizontalCardContainer";
import {TournamentStatus} from "@/src/services/tournaments/tournamentsDTO";
import TournamentStatusBadge from "@/src/components/pagesComponents/tournaments/TournamentStatusBadge";

type TeamCardSmallProps = {
    id: number
    name: string;
    teamsCount: number;
    logoUrl?: string;
    status: TournamentStatus;
}


export default function TournamentCardHorizontal({
                                                     id,
                                                     name,
                                                     logoUrl,
                                                     teamsCount,
                                                     status
                                                 }: TeamCardSmallProps) {
    function handlePress() {
        /*
        router.push({
            pathname: "/tournaments/[tournamentId]",
            params: {
                teamId: id,
            },
        })

         */
        console.log("Premuto!")

    }


    return (
        <HorizontalCardContainer
            variant={"tournament"}
            onPress={handlePress}
        >

            <View style={styles.logoContainer}>
                <Picture variant={"tournament"} style={styles.logo} logoUrl={logoUrl}/>
            </View>

            <View style={styles.tournamentInfo}>
                <View>
                    <Text
                        style={styles.tournamentName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {name}
                    </Text>

                    <View style={styles.teamsRow}>
                        <Ionicons
                            name="people-outline"
                            size={11}
                            color="#A9C7B5"
                        />

                        <Text style={styles.teamsText}>
                            {teamsCount}{" "}
                            {teamsCount === 1 ? "squadra" : "squadre"}
                        </Text>
                    </View>
                </View>

                <TournamentStatusBadge status={status as TournamentStatus}/>
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

    tournamentInfo: {
        flex: 1,
        justifyContent: "space-between",
        marginLeft: 10,
        flexDirection: "row",

    },


    tournamentName: {
        color: teamCardBlueColors.title,
        fontSize: 14,
        lineHeight: 16,
        fontWeight: "800",
        letterSpacing: 0.2,

    },

    teamsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
        gap: 4,

    },

    teamsText: {
        color: teamCardBlueColors.secondaryText,
        fontSize: 10,
        lineHeight: 12,
        fontWeight: "500",
    },


});

