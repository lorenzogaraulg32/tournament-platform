import {ActivityResponse} from "@/src/services/activities/ActivityDTO";
import {paletteVariants, Variant} from "@/src/constants/palette/PaletteManager";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import InfoLabel from "@/src/components/common/labels/InfoLabel";
import { colors } from "@/src/constants/theme";


type ActivitiesSectionProps = {
    activities: ActivityResponse[],
    variant: Variant
}

export function ActivitiesSection({
                                      activities,
                                      variant
                                  }: ActivitiesSectionProps) {


    const palette = paletteVariants[variant].palette

    return (
        <View>
            <InfoLabel text={"Attività"} labelIconName={"time-outline"}/>
            <ScrollView style={[
                styles.activitiesContainer,
                {
                    backgroundColor: palette.defaultColorBK
                }
            ]
            }>
                {activities.length > 0 ? activities.map(activity => {
                        return (
                            <View style={styles.activityRow} key={activity.id}>
                                <Text style={styles.text}>{activity.issuedAt}</Text>
                                <Text style={styles.text} >{activity.label}</Text>
                            </View>
                        )
                    }) :
                    <Text style={styles.text} >Nessuna attività</Text>}
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    activityRow: {
        flexDirection: "row",
        gap: 5
    },

    activitiesContainer: {
        marginTop: 5,
        padding: 10,
        borderRadius: 50,
    },
    text:{
        color: colors.labelSecondary
    }

});