import {Tabs} from "expo-router";
import {StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import {colors} from "@/src/constants/theme"

export default function RootLayout() {
    return (

        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabsBar,
                tabBarActiveTintColor: "#ffffff",
                tabBarInactiveTintColor: "#ffffff",
                tabBarLabelStyle: styles.barLabel,
                tabBarShowLabel: true,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="teams"
                options={{
                    title: "Squadre",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "people" : "people-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="tournaments"
                options={{
                    title: "Tornei",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "trophy" : "trophy-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profilo",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>

    );
}

const styles = StyleSheet.create({

    tabsBar: {
        height: 70,
        paddingTop: 8,
        paddingBottom: 8,

        backgroundColor: colors.background,

        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.35)",

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,

        elevation: 10,
    },


    barLabel: {
        fontSize: 12,
        fontWeight: "600",
    },
});