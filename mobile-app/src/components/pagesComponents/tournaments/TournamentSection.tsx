import ErrorSection from "@/src/components/common/errors/ErrorSection";
import {StyleSheet, Text, View} from "react-native";
import {FontAwesome6} from "@expo/vector-icons";
import {TournamentDetails} from "@/src/services/tournaments/tournamentsDTO";
import {colors, corners} from "@/src/constants/theme";
import TournamentCardHorizontal from "@/src/components/pagesComponents/tournaments/TournamentCardHorizontal";

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
                    <TournamentCardHorizontal
                        key={tournament.id}
                        id={Number(tournament.id)}
                        name={tournament.name}
                        teamsCount={tournament.registeredTeamIds ? tournament.registeredTeamIds.length : 0}
                        status={tournament.status}
                    />
                ))
            )}
        </View>
    );
}


const styles = StyleSheet.create({

    sectionHeader: {
        marginTop: 12,
        marginBottom: 8,
        padding: 12,
        borderRadius: corners.standard,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: colors.grayBK,
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