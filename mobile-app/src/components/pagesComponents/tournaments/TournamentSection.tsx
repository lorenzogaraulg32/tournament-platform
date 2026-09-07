import TeamCardHorizontal from "@/src/components/common/carousel&cards/TeamCardHorizontal";
import ErrorSection from "@/src/components/common/errors/ErrorSection";
import {StyleSheet, Text, View} from "react-native";
import {FontAwesome6} from "@expo/vector-icons";
import {TournamentDetails} from "@/src/services/tournaments/tournamentsDTO";

type TournamentSectionProps = {
    title: string;
    subtitle: string;
    icon: "crown" | "users";
    tournaments: TournamentDetails[];
    emptyMessage: string;
};

export function TournamentSection({
                                      title,
                                      subtitle,
                                      icon,
                                      tournaments,
                                      emptyMessage,
                                  }: TournamentSectionProps) {
    return (
        <View>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                    <FontAwesome6
                        name={icon}
                        size={18}
                        color="#8E2DE2"
                    />
                </View>

                <View>
                    <Text style={styles.sectionTitle}>
                        {title}
                    </Text>

                    <Text style={styles.sectionSubtitle}>
                        {subtitle}
                    </Text>
                </View>
            </View>

            {tournaments.length === 0 ? (
                <ErrorSection
                    text={emptyMessage}
                    variant="warning"
                />
            ) : (
                tournaments.map((tournament) => (
                    <TeamCardHorizontal
                        key={tournament.id}
                        id={Number(tournament.id)}
                        name={tournament.name}
                        playersCount={0}
                    />
                ))
            )}
        </View>
    );
}


const styles = StyleSheet.create({

    sectionHeader: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    sectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 22,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#F4E9FF",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#171B2E",
    },

    sectionSubtitle: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: "400",
        color: "#8A8A8A",
    },
});