import {
    ActivityIndicator, ImageBackground,
    StyleSheet,
    Text,
    View
} from "react-native";
import {useEffect, useState} from "react";
import {UserInfo} from "@/src/services/userService";
import * as UserServices from "@/src/services/userService";

export default function UserInfoSection() {
    return (
        <View >
            <ImageBackground
                source={require("../../../../assets/images/user_info_section_ckg.png")}
                style={styles.card}
                imageStyle={styles.cardImage}
                resizeMode="cover"
            >
                <View style={styles.cardOverlay}/>
                <DataSection/>
            </ImageBackground>
        </View>
    );
}

export function DataSection() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadProfile() {
        try {
            setError(null);

            const user = await UserServices.loadUserInfo();
            setUserInfo(user);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Errore durante il caricamento");
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadProfile();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.feedbackContainer}>
                <ActivityIndicator color="#FFFFFF" size="large"/>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>{error}</Text>
            </View>
        );
    }

    if (!userInfo) {
        return (
            <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>
                    Utente non disponibile
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.dataContainer}>
            <ProfileImage/>

            <View style={styles.verticalSeparator}/>

            <View style={styles.textContainer}>
                <Text
                    style={styles.username}
                    numberOfLines={1}
                >
                    {userInfo.username.toUpperCase()}
                </Text>

                <Text
                    style={styles.email}
                    numberOfLines={1}
                >
                    {userInfo.email}
                </Text>

                <View style={styles.subscriptionBadge}>
                    <Text style={styles.subscriptionText}>
                        Piano gratuito
                    </Text>
                </View>
            </View>
        </View>
    );
}

export function ProfileImage() {
    return (
        <View style={styles.imageContainer}>
            <ImageBackground
                source={require("../../../../assets/images/profilePlaceholder.png")}
                style={styles.profileImage}
                resizeMode="cover"
            />
        </View>
    );
}

const styles = StyleSheet.create({

    card: {
        minHeight: 148,
        borderRadius: 28,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(112, 255, 162, 0.22)",
    },

    cardImage: {
        borderRadius: 28,
    },

    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 24, 14, 0.30)",
    },

    dataContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 18,
    },

    feedbackContainer: {
        minHeight: 148,
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
        borderRadius: 44,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#FFFFFF",
        backgroundColor: "#D9D9D9",
    },

    profileImage: {
        width: "100%",
        height: "100%",
    },

    verticalSeparator: {
        width: 1,
        height: 76,
        marginHorizontal: 18,
        backgroundColor: "rgba(255, 255, 255, 0.22)",
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
    },

    email: {
        marginTop: 6,
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
});