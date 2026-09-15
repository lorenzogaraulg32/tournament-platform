import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import SettingsButton from "@/src/components/common/buttons/SettingsButton";

type OptionsMenuProps = {
    onEdit: () => void;
    onDelete: () => void;
};

export default function OptionsMenu({
                                        onEdit,
                                        onDelete,
                                    }: OptionsMenuProps) {
    const [isVisible, setIsVisible] = useState(false);

    function selectOption(handler: () => void) {
        setIsVisible(false);
        handler();
    }

    return (
        <View style={styles.container}>
            <SettingsButton onPress={() => setIsVisible((previous) => !previous)}/>

            {isVisible && (
                <View style={styles.menu}>
                    <Pressable
                        onPress={() => selectOption(onEdit)}
                        accessibilityRole="button"
                        style={({pressed}) => [
                            styles.item,
                            pressed && styles.itemPressed,
                        ]}
                    >
                        <Ionicons
                            name="create-outline"
                            size={20}
                            color="#FFFFFF"
                        />

                        <Text style={styles.label}>Modifica</Text>
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable
                        onPress={() => selectOption(onDelete)}
                        accessibilityRole="button"
                        style={({pressed}) => [
                            styles.item,
                            pressed && styles.deletePressed,
                        ]}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#FF7474"
                        />

                        <Text style={[styles.label, styles.deleteLabel]}>
                            Elimina
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        alignItems: "flex-end",
        zIndex: 100,
    },

    trigger: {
        padding: 6,
        borderRadius: 20,
    },

    menu: {
        position: "absolute",
        top: 42,
        right: 0,
        width: 170,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: "#16352A",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 13,
    },

    label: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },

    deleteLabel: {
        color: "#FF7474",
    },

    divider: {
        height: 1,
        marginHorizontal: 12,
        backgroundColor: "rgba(255,255,255,0.10)",
    },

    itemPressed: {
        backgroundColor: "rgba(255,255,255,0.08)",
    },

    deletePressed: {
        backgroundColor: "rgba(255,116,116,0.12)",
    },
});