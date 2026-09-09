import {Redirect, Tabs} from "expo-router";
import {ImageBackground, StyleSheet, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useCallback, useEffect, useRef, useState} from "react";
import {ApiRequestError} from "@/src/services/errorService";
import {loadUserInfo} from "@/src/services/users/userService";
import {loadCurrentUserId} from "@/src/services/users/authService";
import ErrorScreen from "@/src/components/common/errors/ErrorScreen";
import LoadingScreen from "@/src/components/common/loading/LoadingScreen";

import {type ColorVariant, variants} from "@/src/constants/bkManager";


type ProfileState =
    | "checking"
    | "available"
    | "missing"
    | "error";


export default function RootLayout() {
    const [profileState, setProfileState] = useState<ProfileState>("checking");
    const [isRetrying, setIsRetrying] = useState(false);
    const isMounted = useRef(true);

    //questo controllo serve nel caso in cui l'utente non è recuperato dopo il login, quindi nel caso non esista
    const resolveProfileState = useCallback(async (): Promise<void> => {
        setIsRetrying(true);

        try {
            const id = await loadCurrentUserId();

            await loadUserInfo(id);

            if (isMounted.current) {
                setProfileState("available");
            }
        } catch (error) {
            if (!isMounted.current) {
                return;
            }

            if (
                error instanceof ApiRequestError &&
                error.status === 404
            ) {
                setProfileState("missing");
                return;
            }

            setProfileState("error");
        } finally {
            if (isMounted.current) {
                setIsRetrying(false);
            }
        }
    }, []);


    useEffect(() => {
        isMounted.current = true;

        void resolveProfileState();

        return () => {
            isMounted.current = false;
        };
    }, [resolveProfileState]);

    if (profileState === "checking") {
        return <LoadingScreen message="Caricamento in corso..."/>;
    }

    if (profileState === "missing") {
        return (
            <Redirect href="/(onboarding)"/>
        );
    }

    if (profileState === "error") {
        return (
            <ErrorScreen
                title="Servizio Momentaneamente indisponibile"
                message={"Errore interno del server"}
                onRetry={resolveProfileState}
                isRetrying={isRetrying}
            />
        );
    }


    return (
        <Tabs
            screenOptions={({route}) => {
                const config = variants[route.name as ColorVariant] ?? variants.home;

                return {
                    headerShown: false,
                    tabBarStyle: styles.tabsBar,
                    tabBarActiveTintColor: "#ffffff",
                    tabBarInactiveTintColor: "#ffffff",
                    tabBarLabelStyle: styles.barLabel,
                    tabBarShowLabel: true,

                    tabBarBackground: () => (
                        <ImageBackground
                            source={config.background}
                            style={StyleSheet.absoluteFill}
                            resizeMode="cover"
                        >
                            <View style={styles.backgroundOverlay}/>
                        </ImageBackground>
                    ),
                };
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({color, size, focused}) => (
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
                    tabBarIcon: ({color, size, focused}) => (
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
                    tabBarIcon: ({color, size, focused}) => (
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
                    tabBarIcon: ({color, size, focused}) => (
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

        backgroundColor: "transparent",

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

    backgroundOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },


    barLabel: {
        fontSize: 12,
        fontWeight: "600",
    },
});