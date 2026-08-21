import {useEffect, useState} from "react";
import {loadUserInfo, UserEntity} from "@/src/services/users/userService";
import {getUserTeams, TeamDetails, TeamInfo} from "@/src/services/teams/teamService";
import {ActivityIndicator, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/src/constants/theme";
import AdminsCard from "@/src/components/app/teams/AdminsCard";
import PlayersCard from "@/src/components/app/teams/PlayersCard";
import {Sport} from "@/src/services/users/userConstants";
import TeamCardVertical from "@/src/components/app/teams/TeamCardVertical";

type CarouselCommonProps = {
    style?: StyleProp<ViewStyle>;
    transparent?: boolean;
};

type CarouselProps =
    | (CarouselCommonProps & {
    variant: "players";
    inputEntity: TeamDetails;
})
    | (CarouselCommonProps & {
    variant: "admins";
    inputEntity: TeamDetails;
})
    | (CarouselCommonProps & {
    variant: "teams";
    inputEntity: UserEntity;
});

type CarouselEntities =
    | {
    type: "users";
    items: UserEntity[];
}
    | {
    type: "teams";
    items: TeamInfo[];
};


export default function HorizontalCarousel({
                                               inputEntity,
                                               variant,
                                               style, transparent
                                           }: CarouselProps) {

    const [entities, setEntities] = useState<CarouselEntities>(
        variant === "teams"
            ? {type: "teams", items: []}
            : {type: "users", items: []}
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isTeam = "adminIds" in inputEntity

    useEffect(() => {
        async function loadTeamPlayers() {
            try {
                setIsLoading(true)
                setError(null)
                if (isTeam) {
                    const players = await Promise.all(
                        inputEntity.playerIds.map(async (playerId: string) => {

                            const userInfo = await loadUserInfo(playerId);

                            return {
                                id: playerId,
                                userInfo
                            };
                        })
                    );
                    setEntities({
                        type: "users",
                        items: players
                    });
                }

            } catch (error) {
                console.log("ERRORE CARICAMENTO GIOCATORI: " + error)
                setError("Errore caricamento giocatori")
            } finally {
                setIsLoading(false)
            }
        }

        async function loadTeamAdmins() {
            try {
                setIsLoading(true)
                setError(null)
                if (isTeam) {
                    const admins = await Promise.all(
                        inputEntity.adminIds.map(async (adminId: string) => {

                            const userInfo = await loadUserInfo(adminId);

                            const admin: UserEntity = {
                                id: adminId,
                                userInfo: userInfo
                            };

                            return admin;
                        })
                    );
                    setEntities({
                        type: "users",
                        items: admins
                    });
                }

            } catch (error) {
                console.log("ERRORE CARICAMENTO ADMIN: " + error)
                setError("Errore caricamento admin")
            } finally {
                setIsLoading(false)
            }
        }

        async function loadUserTeams() {
            try {
                setIsLoading(true)
                setError(null)
                if (!isTeam) {
                    const teams = await getUserTeams(inputEntity.id)
                    setEntities({
                        type: "teams",
                        items: teams
                    });
                }

            } catch (error) {
                console.log("ERRORE CARICAMENTO SQUADRE: " + error)
                setError("Errore caricamento Squadre")
            } finally {
                setIsLoading(false)
            }
        }

        if (variant === "players") {
            void loadTeamPlayers()
        } else if (variant === "admins") {
            void loadTeamAdmins()
        } else {
            void loadUserTeams()
        }

    }, [inputEntity, variant]);

    return (
        <LinearGradient
            colors={
                transparent
                    ? ["transparent", "transparent", "transparent"]
                    : [colors.textThird, "#EAF8EF", "#ebfff0"]
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[
                styles.gradient,
                styles.container,
                style
            ]}
        >
            <ScrollView
                style={styles.carousel}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardContainer}
            >
                {isLoading ? (
                    <ActivityIndicator size="large" color="#ffffff"/>
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : entities.type === "users" ? (

                    variant === "players" ? (
                        entities.items.length === 0 ? (
                            <Text style={styles.errorText}>Nessun giocatore nella squadra</Text>
                        ) : (
                            entities.items.map((player) => (
                                <PlayersCard
                                    key={player.id}
                                    player={player}
                                    //todo: l'entità squadra deve avere uno sport!
                                    sport={Sport.FOOTBALL}/>
                            ),)
                        )
                    ) : variant === "admins" ? (
                        entities.items.length === 0 ? (
                            <Text style={styles.errorText}>Nessun admin nella squadra</Text>
                        ) : (
                            entities.items.map((admin) => (
                                <AdminsCard
                                    key={admin.id}
                                    admin={admin}
                                    team={inputEntity}
                                />
                            ),)
                        )
                    ) : (<View></View>)
                ) : entities.type === "teams" ? (
                    entities.items.length === 0 ? (
                        <Text style={styles.errorText}>Nessuna squadra</Text>
                    ) : (
                        entities.items.map((team) => (
                            <TeamCardVertical
                                key={team.id}
                                teamDetails={team}/>
                        ))
                    )
                ) : (
                    <View/>
                )}
            </ScrollView>


        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        justifyContent: "space-between",
        flexDirection: "row",
        gap: 5,
    },

    cardContainer: {
        justifyContent: "space-evenly",
        flexDirection: "row",
        gap: 5,
    },

    carousel: {
        width: "100%",
    },


    gradient: {
        borderRadius: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#D0EBDD",
    },

    errorText: {
        color: colors.error,
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
    },
});