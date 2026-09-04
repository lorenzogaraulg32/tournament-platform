import { colors } from "@/src/constants/theme";
import {Pressable,Text,StyleSheet, View} from "react-native";

export type TabItem<T extends string> = {
    id: T;
    label: string;
};


type TabsContainerProps<T extends string> = {
    tabs: readonly TabItem<T>[];
    activeTab: T;
    onTabChange: (tab: T) => void;
    color : "orange" | "purple"
};

export default function TabsContainer<T extends string>({
                                                            tabs,
                                                            activeTab,
                                                            onTabChange,
    color
                                                        }: TabsContainerProps<T>) {
    return (
        <View style={styles.tabsContainer}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                    <Pressable
                        key={tab.id}
                        accessibilityRole="button"
                        accessibilityState={{selected: isActive}}
                        onPress={() => onTabChange(tab.id)}
                        style={({pressed}) => [
                            styles.tab,
                            isActive && styles.activeTab,
                            pressed && styles.pressedTab,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                isActive && color === "orange" && styles.activeTabTextOrange,
                                isActive && color === "purple" && styles.activeTabTextPurple,
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({

    content: {
        paddingHorizontal: 5,
    },

    tabContent: {
        flex: 1,
        paddingTop: 18,
    },


    tabsContainer: {
        flexDirection: "row",
        padding: 4,
        backgroundColor: "#F0F3F1",
        borderRadius: 16,
        gap: 4,
        marginHorizontal: 15,
        marginBottom: 10,
    },

    tab: {
        flex: 1,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },

    activeTab: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },

    pressedTab: {
        opacity: 0.75,
    },

    tabText: {
        color: "#89928E",
        fontSize: 15,
        fontWeight: "700",
    },

    activeTabTextOrange: {
        color: colors.orangeDefault,
    },

    activeTabTextPurple: {
        color: colors.purpleDefault,
    },




});