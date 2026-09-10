import {Modal, Pressable, ScrollView, StyleSheet, View} from "react-native";
import {ReactNode, useState} from "react";
import InfoLabel from "@/src/components/common/labels/InfoLabel";
import Ionicons from "@expo/vector-icons/Ionicons";
import {colors} from "@/src/constants/theme";
import {SafeAreaView} from "react-native-safe-area-context";

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
    const [isFullPageVisible, setFullPageVisible] = useState(false);

    const goToFullPage = () => {
        setFullPageVisible(true);
    };

    const closeFullPage = () => {
        setFullPageVisible(false);
    };

    return (
        <>
            <ScrollView style={styles.collapsableContainer}>
                <View style={styles.labelContainer}>
                    <View style={styles.leftContainer}>
                        <InfoLabel
                            text={label}
                            labelIconName={iconName}
                        />
                        <Pressable
                            onPress={goToFullPage}
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
                                name="chevron-forward"
                                size={20}
                                color={colors.labelInfo}
                            />
                        </Pressable>
                    </View>
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
                            size={20}
                            color={colors.labelInfo}
                        />
                    </Pressable>
                </View>
                {isExpanded && (
                    <View style={styles.section}>
                        {children}
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={isFullPageVisible}
                animationType="slide"
                presentationStyle="fullScreen"
                onRequestClose={closeFullPage}
            >
                <SafeAreaView style={styles.fullPage}>
                    <View style={styles.fullPageHeader}>
                        <Pressable
                            onPress={closeFullPage}
                            accessibilityRole="button"
                            accessibilityLabel="Chiudi vista completa"
                            hitSlop={8}
                            style={({pressed}) => [
                                styles.iconButton,
                                pressed && {opacity: 0.65},
                            ]}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={20}
                                color={colors.labelInfo}
                            />
                        </Pressable>

                        <View style={styles.fullPageTitle}>
                            <InfoLabel
                                text={label}
                                labelIconName={iconName}
                            />
                        </View>
                    </View>

                    <ScrollView
                        style={styles.fullPageScroll}
                        contentContainerStyle={styles.fullPageContent}
                    >
                        {children}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </>
    );
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

    leftContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 16
    },
    iconButton: {
        width: 26,
        height: 26,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.06)",
    },

    fullPage: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    fullPageHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.08)",
    },

    fullPageTitle: {
        flex: 1,
    },

    fullPageScroll: {
        flex: 1,
    },

    fullPageContent: {
        padding: 16,
        paddingBottom: 32,
    },

    section: {
        maxHeight: 280
    },


})