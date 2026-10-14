
import { ActivityResponse } from "@/src/services/activities/ActivityDTO";
import { paletteVariants, Variant } from "@/src/constants/palette/PaletteManager";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import InfoLabel from "@/src/components/common/labels/InfoLabel";
import { colors } from "@/src/constants/theme";
import { formatLocalDateTime } from "@/src/services/common";
import { HorizontalSeparator } from "@/src/components/common/HorizontalSeparator";

type ActivitiesSectionProps = {
    activities: ActivityResponse[];
    variant: Variant;
};

export function ActivitiesSection({
                                      activities,
                                      variant
                                  }: ActivitiesSectionProps) {

    const palette = paletteVariants[variant].palette;

    return (
        <View
            style={[
                styles.sectionContainer,
                {
                    backgroundColor: palette.defaultColorBK,
                    borderColor: palette.borderColor
                }
            ]}
        >
            <View style={styles.labelContainer}>
                <InfoLabel
                    text="Attività recenti"
                    labelIconName="time-outline"
                />
            </View>

            <HorizontalSeparator />

            {activities.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="time-outline"
                        size={30}
                        color={colors.labelSecondary}
                    />

                    <Text style={styles.emptyTitle}>
                        Nessuna attività recente
                    </Text>

                    <Text style={styles.emptyDescription}>
                        Le novità della squadra appariranno qui.
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.activitiesContainer}
                    contentContainerStyle={styles.activitiesContent}
                    showsVerticalScrollIndicator={activities.length > 3}
                    nestedScrollEnabled
                >
                    {activities.map((activity, index) => (
                        <View key={activity.id}>
                            <View style={styles.activityRow}>
                                <View style={styles.activityDot} />

                                <View style={styles.activityContent}>
                                    <Text style={styles.activityLabel}>
                                        {activity.label}
                                    </Text>

                                    <Text style={styles.activityDate}>
                                        {formatLocalDateTime(activity.issuedAt)}
                                    </Text>
                                </View>
                            </View>

                            {index < activities.length - 1 && (
                                <View
                                    style={[
                                        styles.activitySeparator,
                                        { backgroundColor: palette.borderColor }
                                    ]}
                                />
                            )}
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 14,
        gap: 12
    },

    labelContainer: {
        flexDirection: "row",
        alignItems: "center"
    },

    activitiesContainer: {
        maxHeight: 260
    },

    activitiesContent: {
        paddingHorizontal: 4
    },

    activityRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        paddingVertical: 12
    },

    activityDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: "#CE530D",
        marginTop: 5
    },

    activityContent: {
        flex: 1,
        gap: 5
    },

    activityLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#292929",
        lineHeight: 20
    },

    activityDate: {
        fontSize: 12,
        color: colors.labelSecondary
    },

    activitySeparator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 21
    },

    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        paddingHorizontal: 10,
        gap: 8
    },

    emptyTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#514343"
    },

    emptyDescription: {
        fontSize: 12,
        color: colors.labelSecondary,
        textAlign: "center"
    }
});
