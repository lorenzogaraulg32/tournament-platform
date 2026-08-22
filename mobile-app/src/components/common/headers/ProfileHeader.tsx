import {ActivityIndicator, Pressable, StyleSheet, Text, View} from "react-native";
import HeaderContainer from "./headerContainer";
import {UserInfo} from "@/src/services/users/userService";
import {AuthInfo, loadCurrentUserId} from "@/src/services/users/authService";
import Picture from "@/src/components/common/Picture";
import Ionicons from "@expo/vector-icons/Ionicons";
import {router} from "expo-router";
import {useEffect, useState} from "react";
import {colors} from "@/src/constants/theme";


/**
 * Mostra le principali informazioni dell'utente, quali:
 * - Username
 * - Email
 * - Subscription Plan
 */

export type ProfileHeaderProps = {
    isLoading: boolean
    userInfo?: UserInfo
    authInfo?: AuthInfo,

}


export default function ProfileHeader({
                                          isLoading,
                                          userInfo,
                                          authInfo
                                      }: ProfileHeaderProps) {

    const [modBtn, setModBtn] = useState(false);




    useEffect(() => {

        async function canShowModBtn() {
            if (!authInfo) {
                setModBtn(false);
                return;
            }
            const currentUserId = await loadCurrentUserId();

            if (!currentUserId) {
                setModBtn(false);
                return;
            }

            setModBtn(currentUserId === authInfo.id);
        }

        void canShowModBtn()
    }, [authInfo]);


    const onBackPress = () => {
        router.back()
    }


    const onOptionsPress = () => {
        console.log("options premuto")
    }


    function formatLocationLabel(location: string): string {
        const parts = location.split(",")
        return parts[0] + "  · " + parts[1] + "  · " + parts[2]
    }

    return (
        <HeaderContainer
            backgroundSource={require("../../../../assets/images/backgrounds/redBackground.png")}
            overlayColor="rgba(0, 24, 14, 0.30)"
            borderColor="rgba(112, 255, 162, 0.22)"
        >

            <Pressable
                onPress={onBackPress}
                accessibilityRole="button"
                accessibilityLabel="Torna indietro"
                hitSlop={12}
                android_ripple={{
                    color: "rgba(255, 255, 255, 0.20)",
                }}
                style={({pressed}) => [
                    styles.backButton,
                    pressed && styles.backButtonPressed,
                ]}
            >
                {({pressed}) => (
                    <Ionicons
                        name="arrow-back"
                        size={22}
                        color={pressed ? "rgba(255, 255, 255, 0.75)" : "#FFFFFF"}
                    />
                )}
            </Pressable>
            {modBtn ? (
                <Pressable
                    onPress={onOptionsPress}
                    accessibilityRole="button"
                    accessibilityLabel="Modifica"
                    hitSlop={12}
                    android_ripple={{
                        color: "rgba(255, 255, 255, 0.20)",
                    }}
                    style={({pressed}) => [
                        styles.modBtn,
                        pressed && styles.modPressed,
                    ]}
                >
                    {({pressed}) => (
                        <Ionicons
                            name="pencil"
                            size={22}
                            color={pressed ? "rgba(255, 255, 255, 0.75)" : "#FFFFFF"}
                        />
                    )}
                </Pressable>
            ) : (<View></View>)}


            {isLoading ? (
                <View style={styles.feedbackContainer}>
                    <ActivityIndicator color="#FFFFFF" size="large"/>
                </View>
            ) : !userInfo || !authInfo ? (
                <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackText}>
                        Utente non disponibile
                    </Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <Picture
                        logoUrl={userInfo.profilePicUrl}
                        style={styles.imageContainer}
                        variant={"player"}/>

                    <View style={styles.verticalSeparator}/>

                    <View style={styles.textContainer}>
                        <Text
                            style={styles.username}
                            numberOfLines={1}
                        >
                            {userInfo.username.toUpperCase()}
                        </Text>

                        { userInfo.location ? (
                            <Text
                                style={styles.location}
                                numberOfLines={1}
                            >
                                {formatLocationLabel(userInfo.location.label)}
                            </Text>) :(<View></View>)
                        }


                        <Text
                            style={styles.email}
                            numberOfLines={1}
                        >
                            {authInfo.email}
                        </Text>

                        <View style={styles.subscriptionBadge}>
                            <Text style={styles.subscriptionText}>
                                Piano gratuito
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </HeaderContainer>

    );
}


const styles = StyleSheet.create({


    card: {
        borderRadius: 28,
        overflow: "hidden",
    },

    cardImage: {
        borderRadius: 28,
    },

    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 24, 14, 0.30)",
    },

    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        marginTop: 30,
        paddingVertical: 12,
        height: 160,
    },

    feedbackContainer: {
        minHeight: 120,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    feedbackText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "500",
        textAlign: "center",
    },

    imageHalo: {
        width: 102,
        height: 102,
        borderRadius: 51,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(54, 255, 130, 0.11)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.20)",
    },

    imageContainer: {
        width: 88,
        height: 88,
        marginLeft: 10,
        borderRadius: 1000,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#FFFFFF",
        backgroundColor: "#D9D9D9",
    },

    verticalSeparator: {
        width: 1,
        height: 134,
        marginHorizontal: 14,
        backgroundColor: "rgba(255, 255, 255, 0.24)",
    },

    textContainer: {
        flex: 1,
        minWidth: 0,
        justifyContent: "center",
    },

    username: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: 0.2,
        marginBottom: 6,
    },

    location: {
        color: colors.textOffWhite,
        fontSize: 12,
    },

    email: {
        marginTop: 2,
        color: "rgba(255, 255, 255, 0.78)",
        fontSize: 14,
        fontWeight: "400",
    },

    subscriptionBadge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
        paddingHorizontal: 11,
        paddingVertical: 6,
        borderRadius: 18,
        backgroundColor: "rgba(255, 255, 255, 0.14)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.16)",
    },

    badgeDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: 7,
        backgroundColor: "#6DFF9C",
    },

    subscriptionText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
    },


    backButton: {
        position: "absolute",

        left: 15,
        top: 15,
        width: 38,
        height: 38,

        borderRadius: 21,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(255,255,255,0.19)",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.58)",

        overflow: "hidden",
    },

    backButtonPressed: {
        backgroundColor: "rgba(255, 255, 255, 0.24)",
        borderColor: "rgba(255, 255, 255, 0.35)",

        opacity: 0.85,

        transform: [
            {scale: 0.92},
        ],
    },

    modBtn: {
        position: "absolute",
        right: 15,
        top: 15,
        width: 38,
        height: 38,

        borderRadius: 21,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(255, 255, 255, 0.12)",

        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.18)",

        overflow: "hidden",
    },

    modPressed: {
        backgroundColor: "rgba(255, 255, 255, 0.24)",
        borderColor: "rgba(255, 255, 255, 0.35)",

        opacity: 0.85,

        transform: [
            {scale: 0.92},
        ],
    },


});