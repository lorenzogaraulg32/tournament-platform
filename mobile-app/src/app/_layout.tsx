import {Stack} from "expo-router";

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="(auth)"/>

            <Stack.Screen
                name="(app)"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="team/[teamId]"
                options={{
                    headerShown: false,
                    animation: "slide_from_bottom",
                }}
            />
        </Stack>

    );
}
