import {Stack} from "expo-router";
import {GestureHandlerRootView} from "react-native-gesture-handler";

/**
 * Layout di base dell'applicazione, gestisce le opzioni dello schermo, come la navbar, status bar, le gesture ecc.
 * @constructor
 */
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

                <Stack.Screen name="(app)"/>
            </Stack>
        </GestureHandlerRootView>
    );
}
