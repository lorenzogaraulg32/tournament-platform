import {ActivityIndicator, Pressable, StyleSheet, Text, View} from "react-native";
import {UserInfo} from "@/src/services/users/userService";
import {AuthInfo, loadCurrentUserId} from "@/src/services/users/authService";
import Picture from "@/src/components/common/images/Picture";
import Ionicons from "@expo/vector-icons/Ionicons";
import {router} from "expo-router";
import {useEffect, useState} from "react";


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


export default function HeaderProfile({
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
        return location
            .split(",")
            .map(part => part.trim())
            .filter(Boolean)
            .join("  ·  ");
    }

    return (
        <View>

            <Pressable
                onPress={onBackPress}
                hitSlop={16}
                style={[
                    styles.backButton,
                ]}
            >
                <Ionicons
                    name="chevron-back"
                    size={28}
                    color="#FFFFFF"
                />
            </Pressable>

            {isLoading ? (
                <View style={styles.container}>
                    <ActivityIndicator color="#FFFFFF" size="large"/>
                </View>
            ) : !userInfo || !authInfo ? (
                <View style={styles.container}>
                    <Text style={styles.feedbackText}>
                        Utente non disponibile
                    </Text>
                </View>
            ) : (
                <View style={styles.container}>

                    <View style={styles.imageContainer}>
                        <Picture
                            variant="player"
                            logoUrl={userInfo.profilePicUrl}
                            style={styles.profileImage}
                        />
                    </View>

                    <View style={styles.rightContainer}>

                        <View style={styles.titleRow}>
                            <Text
                                style={styles.profileName}
                                numberOfLines={1}
                            >
                                {`${userInfo.firstName} ${userInfo.lastName}`}
                            </Text>

                            {modBtn && (
                                <Pressable
                                    onPress={onOptionsPress}
                                    accessibilityRole="button"
                                    accessibilityLabel="Modifica profilo"
                                    hitSlop={10}
                                    style={({pressed}) => [
                                        styles.editButton,
                                        pressed && styles.editButtonPressed,
                                    ]}
                                >
                                    <Ionicons
                                        name="pencil-outline"
                                        size={18}
                                        color="#FFFFFF"
                                    />
                                </Pressable>
                            )}
                        </View>

                        <Text
                            style={styles.username}
                            numberOfLines={1}
                        >
                            @{userInfo.username}
                        </Text>

                        {userInfo.location && (
                            <Text
                                style={styles.location}
                                numberOfLines={1}
                            >
                                {formatLocationLabel(userInfo.location.label)}
                            </Text>
                        )}

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

                </View>)}
        </View>

    );
}


const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 25,
        gap: 25,
    },

    feedbackText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
    },

    imageContainer: {
        width: 80,
        height: 80,

        borderRadius: 40,
        overflow: "hidden",

        borderWidth: 2.5,
        borderColor: "#FFFFFF",

        backgroundColor: "#D9D9D9",
    },

    profileImage: {
        width: "100%",
        height: "100%",
    },

    rightContainer: {
        flex: 1,
        minWidth: 0,
        justifyContent: "center",
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minWidth: 0,
    },

    profileName: {
        flexShrink: 1,

        color: "#FFFFFF",
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "800",
    },

    username: {
        marginTop: 2,

        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
    },

    location: {
        marginTop: 3,

        color: "rgba(255,255,255,0.78)",
        fontSize: 12,
    },

    email: {
        marginTop: 3,

        color: "rgba(255,255,255,0.78)",
        fontSize: 12,
    },

    subscriptionBadge: {
        alignSelf: "flex-start",

        marginTop: 10,

        paddingHorizontal: 10,
        paddingVertical: 5,

        borderRadius: 12,

        backgroundColor: "rgba(255,255,255,0.18)",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.28)",
    },

    subscriptionText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "800",
    },


    backButton: {
        position: "absolute",

        left: 0,
        zIndex: 10,

        width: 35,
        height: 35,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 18,

        backgroundColor: "rgba(255,255,255,0.14)",

    },


    editButton: {
        width: 33,
        height: 33,

        borderRadius: 18,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(255,255,255,0.10)",
    },

    editButtonPressed: {
        backgroundColor: "rgba(255,255,255,0.20)",
        transform: [{scale: 0.94}],
    },


});