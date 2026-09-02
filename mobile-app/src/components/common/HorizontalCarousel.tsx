import {useEffect, useState} from "react";
import {loadUserInfo, UserEntity} from "@/src/services/users/userService";
import {getUserTeams, TeamDetails, TeamInfo} from "@/src/services/teams/teamService";
import {ActivityIndicator, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/src/constants/theme";
import AdminsCard from "@/src/components/pagesComponents/teams/AdminsCard";
import PlayersCard from "@/src/components/pagesComponents/teams/PlayersCard";
import {Sport} from "@/src/services/users/userConstants";
import TeamCardVertical from "@/src/components/pagesComponents/teams/TeamCardVertical";
import {normalizeApiRequestError} from "@/src/services/errorService";

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

        let isActive = true;

        async function loadEntities() {
            try {
                setIsLoading(true)
                setError(null)
                switch (variant) {
                    case "teams":
                        await loadUserTeams();
                        break;

                    case "admins":
                        await loadTeamAdmins();
                        break;

                    case "players":
                        await loadTeamPlayers();
                        break;
                }
            } catch (error) {
                if (!isActive) {
                    return;
                }
                const apiError = normalizeApiRequestError(error)

                // Redirect già gestito da authenticatedFetch
                if (apiError.status === 401) {
                    return;
                }

                setError(apiError.message)
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }

            }
        }

        async function loadTeamPlayers() {
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
        }

        async function loadTeamAdmins() {
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
        }

        async function loadUserTeams() {
            if (!isTeam) {
                const teams = await getUserTeams(inputEntity.id)
                setEntities({
                    type: "teams",
                    items: teams
                });
            }
        }

        void loadEntities()

        return () => {
            isActive = false
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
                contentContainerStyle={[
                    styles.cardContainer,
                    entities.items.length === 0 && styles.emptyScrollContent,
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator size="large" color="#ffffff"/>
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : entities.type === "users" ? (

                    variant === "players" ? (
                        entities.items.length === 0 ? (
                            <Text style={styles.emptyEntitiesText}>Nessun giocatore nella squadra</Text>
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
                            <Text style={styles.emptyEntitiesText}>Nessun admin nella squadra</Text>
                        ) : (
                            entities.items.map((admin) => (
                                <AdminsCard
                                    key={admin.id}
                                    admin={admin}
                                    team={inputEntity}
                                />
                            ),)
                        )
                    ) : (<View/>)
                ) : entities.type === "teams" ? (
                    entities.items.length === 0 ? (
                        <Text style={styles.emptyEntitiesText}>Crea una squadra oppure{"\n"} unisciti tramite il codice d'invito</Text>
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
        flexDirection: "row",
    },

    cardContainer: {
        justifyContent: "space-evenly",
        flexDirection: "row",
        gap: 5,
    },

    carousel: {
        width: "100%",
    },

    emptyScrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
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

    emptyEntitiesText:{
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
        color: "#7c7c7c",
        flex: 1,
    },
});