import {Redirect, usePathname, withLayoutContext} from "expo-router";

import {
    createMaterialTopTabNavigator,
    MaterialTopTabBar,
    type MaterialTopTabBarProps,
    type MaterialTopTabNavigationEventMap,
    type MaterialTopTabNavigationOptions,
    type MaterialTopTabNavigationProp,
} from "expo-router/js-top-tabs";

import {type ParamListBase, StackActions, type TabNavigationState,} from "expo-router/react-navigation";


import {ImageBackground, StyleSheet, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useCallback, useEffect, useRef, useState} from "react";
import {ApiRequestError} from "@/src/services/errorService";
import {loadUserInfo} from "@/src/services/users/userService";
import {loadCurrentUserId} from "@/src/services/users/authService";
import ErrorScreen from "@/src/components/common/errors/ErrorScreen";
import LoadingScreen from "@/src/components/common/loading/LoadingScreen";

import {type BKVariant, variants} from "@/src/constants/bkManager";

const TAB_ROOT_PATHS = new Set([
    "/home",
    "/teams",
    "/tournaments",
    "/profile",
]);

type ProfileState =
    | "checking"
    | "available"
    | "missing"
    | "error";

const {Navigator} = createMaterialTopTabNavigator();

const SwipeTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

type TabListenerArgs = {
    navigation: MaterialTopTabNavigationProp<ParamListBase>;
    route: TabNavigationState<ParamListBase>["routes"][number];
};


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

    const pathname = usePathname();
    const isTabRoot = TAB_ROOT_PATHS.has(pathname);


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
        <SwipeTabs
            backBehavior="none"
            tabBarPosition="bottom"
            screenListeners={({navigation, route}: TabListenerArgs) => ({
                blur: () => {
                    const tab = navigation
                        .getState()
                        .routes.find((item) => item.key === route.key);

                    const stack = tab?.state;

                    if (
                        stack?.type === "stack" &&
                        stack.key &&
                        (stack.index ?? 0) > 0
                    ) {
                        navigation.dispatch({
                            ...StackActions.popToTop(),
                            target: stack.key,
                        });
                    }
                },
            })}
            screenOptions={{
                swipeEnabled: isTabRoot,
                lazy: true,
                tabBarShowIcon: true,
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#ffffff",
                tabBarInactiveTintColor: "#ffffff",
                tabBarLabelStyle: styles.barLabel,
                tabBarStyle: {
                    backgroundColor: "transparent",
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarIndicatorStyle: {
                    height: 0,
                },
            }}
            tabBar={(props: MaterialTopTabBarProps) => {
                const route = props.state.routes[props.state.index];
                const config =
                    variants[route.name as BKVariant] ?? variants.home;

                return (
                    <ImageBackground
                        source={config.background}
                        resizeMode="cover"
                        style={{
                            paddingBottom: 15,
                            borderTopWidth: 1,
                            borderTopColor: "rgba(255, 255, 255, 0.35)",
                        }}
                    >
                        <View
                            pointerEvents="none"
                            style={styles.backgroundOverlay}
                        />

                        <MaterialTopTabBar {...props} />
                    </ImageBackground>
                );
            }}
        >
            <SwipeTabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <SwipeTabs.Screen
                name="teams"
                options={{
                    title: "Squadre",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons
                            name={focused ? "people" : "people-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <SwipeTabs.Screen
                name="tournaments"
                options={{
                    title: "Tornei",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons
                            name={focused ? "trophy" : "trophy-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <SwipeTabs.Screen
                name="profile"
                options={{
                    title: "Profilo",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </SwipeTabs>
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