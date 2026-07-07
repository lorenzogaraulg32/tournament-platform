import {Tabs} from "expo-router";

export default function RootLayout() {
    return (
        <Tabs screenOptions={{headerShown: false}}>
            <Tabs.Screen
                name="home"
                options={{title: "Home"}}
            />

            <Tabs.Screen
                name="teams"
                options={{title: "Squadre"}}
            />

            <Tabs.Screen
                name="tournaments"
                options={{title: "Tornei"}}
            />

            <Tabs.Screen
                name="profile"
                options={{title: "Profilo"}}
            />
        </Tabs>
    );
}
