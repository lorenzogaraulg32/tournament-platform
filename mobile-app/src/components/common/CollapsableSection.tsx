import {Pressable, ScrollView, StyleSheet, View} from "react-native";
import {ReactNode, useState} from "react";
import InfoLabel from "@/src/components/common/labels/InfoLabel";
import Ionicons from "@expo/vector-icons/Ionicons";
import {colors} from "@/src/constants/theme";

type CollapsableSectionProps = {
    label: string,
    iconName: keyof typeof Ionicons.glyphMap;
    children: ReactNode
}


export default function CollapsableSection({
                                               label,
                                               iconName,
                                               children
                                           }: CollapsableSectionProps) {

    const [isExpanded, setExpanded] = useState<boolean>(true)

    return (
        <ScrollView style={styles.collapsableContainer}>
            <View style={styles.labelContainer}>
                <InfoLabel
                    text={label}
                    labelIconName={iconName}
                />

                <Pressable
                    onPress={() => setExpanded((previous) => !previous)}
                    accessibilityRole="button"
                    accessibilityLabel={isExpanded ? `Comprimi ${label}` : `Espandi ${label}`}
                    accessibilityState={{expanded: isExpanded}}
                    hitSlop={8}
                    style={({pressed}) => [
                        styles.iconButton,
                        pressed && {opacity: 0.65},
                    ]}
                >
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={21}
                        color={colors.labelInfo}
                    />
                </Pressable>
            </View>
            {isExpanded && children}
        </ScrollView>
    )

}

const styles = StyleSheet.create({

    collapsableContainer: {
        flex: 1,

    },

    labelContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    iconButton: {
        width: 26,
        height: 26,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.06)",
    },

})