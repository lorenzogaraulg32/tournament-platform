import {Pressable, ScrollView, StyleSheet, View} from "react-native";
import {ReactNode, useState} from "react";
import InfoLabel from "@/src/components/common/labels/InfoLabel";
import Ionicons from "@expo/vector-icons/Ionicons";
import {colors} from "@/src/constants/theme";
import FullPageModal from "@/src/components/common/FullPageModal";

type CollapsableSectionProps = {
    label: string,
    iconName: keyof typeof Ionicons.glyphMap,
    children: ReactNode | ((isMod: boolean) => ReactNode),
    canMod?: boolean,
}


export default function CollapsableSection({
                                               label,
                                               iconName,
                                               children,
                                               canMod = false,
                                           }: CollapsableSectionProps) {

    const [isExpanded, setExpanded] = useState<boolean>(true)
    const [isFullPageVisible, setFullPageVisible] = useState(false);
    const [isMod, setMod] = useState(false);


    const goToFullPage = () => {
        setFullPageVisible(true);
    };

    const closeFullPage = () => {
        setFullPageVisible(false);
        setMod(false);
    };

    function renderContent(modify: boolean) {
        return typeof children === "function"
            ? children(modify)
            : children;
    }

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
                                color={colors.label}
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
                            color={colors.label}
                        />
                    </Pressable>
                </View>
                {isExpanded && (
                    <View style={styles.section}>
                        {renderContent(false)}
                    </View>
                )}
            </ScrollView>

            <FullPageModal
                visible={isFullPageVisible}
                onClose={closeFullPage}
                label={label}
                iconName={iconName}
                headerAction={
                    canMod ? (
                        <Pressable
                            onPress={() => setMod((previous) => !previous)}
                            accessibilityRole="button"
                            accessibilityLabel={
                                isMod ? "Termina modifica" : "Modifica elenco"
                            }
                            accessibilityState={{selected: isMod}}
                            hitSlop={8}
                            style={({pressed}) => [
                                styles.modButton,
                                pressed && {opacity: 0.65},
                            ]}
                        >
                            <Ionicons
                                name={isMod ? "checkmark-outline" : "create-outline"}
                                size={22}
                                color={colors.error}
                            />
                        </Pressable>
                    ) : null
                }
            >
                {renderContent(canMod && isMod)}
            </FullPageModal>
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
        justifyContent: "space-between",
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

    iconAndTitle: {
        flex: 1,
        flexDirection: "row",
        gap: 12,
    },

    modButton: {
        width: 35,
        height: 35,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.errorBK,
        borderWidth: 1,
        borderColor: colors.error
    },

})