import Ionicons from "@expo/vector-icons/Ionicons";
import {ReactNode} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Modal, Pressable, ScrollView, StyleSheet, View} from "react-native";
import {colors} from "@/src/constants/theme";
import InfoLabel from "@/src/components/common/labels/InfoLabel";

type FullPageModalProps = {
    visible: boolean;
    onClose: () => void;
    label: string;
    iconName: keyof typeof Ionicons.glyphMap;
    children: ReactNode;
    headerAction?: ReactNode;
};


export default function FullPageModal({
                                          visible,
                                          onClose,
                                          label,
                                          iconName,
                                          children,
                                          headerAction,
                                      }: FullPageModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.fullPage}>
                <View style={styles.fullPageHeader}>
                    <View style={styles.iconAndTitle}>
                        <Pressable
                            onPress={onClose}
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
                                color={colors.label}
                            />
                        </Pressable>

                        <View style={styles.fullPageTitle}>
                            <InfoLabel
                                text={label}
                                labelIconName={iconName}
                            />
                        </View>
                    </View>

                    {headerAction}
                </View>

                <ScrollView
                    style={styles.fullPageScroll}
                    contentContainerStyle={styles.fullPageContent}
                >
                    {children}
                </ScrollView>
            </SafeAreaView>
        </Modal>
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