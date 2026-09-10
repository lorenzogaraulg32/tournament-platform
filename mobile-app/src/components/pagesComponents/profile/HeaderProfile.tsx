import {StyleSheet, Text, View} from "react-native";
import {UserInfo} from "@/src/services/users/userService";
import {AuthInfo} from "@/src/services/users/authService";
import Picture from "@/src/components/common/images/Picture";
import {router} from "expo-router";
import SettingsButton from "@/src/components/common/buttons/SettingsButton";
import BackButton from "@/src/components/common/buttons/BackButton";


/**
 * Mostra le principali informazioni dell'utente, quali:
 * - Username
 * - Email
 * - Subscription Plan
 */

export type ProfileHeaderProps = {
    userInfo: UserInfo
    authInfo: AuthInfo,
    canEdit: boolean,
    canBack: boolean,
}


export default function HeaderProfile({
                                          userInfo,
                                          authInfo,
                                          canEdit,
                                          canBack
                                      }: ProfileHeaderProps) {


    const onBackPress = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(app)/home");
        }
    };

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

            {canBack &&
                <BackButton onPress={onBackPress}/>
            }

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

                        {canEdit && (
                            <SettingsButton onPress={onOptionsPress}/>
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

            </View>
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
        justifyContent: "space-between",
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


});