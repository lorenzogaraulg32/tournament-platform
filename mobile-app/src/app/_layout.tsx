import {Stack} from "expo-router";
import {GestureHandlerRootView} from "react-native-gesture-handler";


export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <Stack
                screenOptions={{
                    navigationBarHidden: true,
                    statusBarHidden: false,
                    autoHideHomeIndicator: true,
                    headerShown: false,
                    statusBarStyle: "auto",
            }}>
                <Stack.Screen name="(auth)"/>

                <Stack.Screen
                    name="(onboarding)"
                />

                <Stack.Screen
                    name="(app)"
                />
            </Stack>
        </GestureHandlerRootView>
    );
}
