import Background from "@/src/components/common/Background";
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import ProfileHeader from "@/src/components/app/profile/ProfileHeader";
import Ionicons from "@expo/vector-icons/Ionicons";
import TitleApp from "@/src/components/common/headers/HeaderMain";
import {colors} from "@/src/constants/theme"
import {AuthInfo, handleLogout, loadCurrentUserAuthInfo} from "@/src/services/users/authService";
import {loadUserInfo, UserInfo} from "@/src/services/users/userService";
import {useEffect, useState} from "react";

export default function ProfilePage() {

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [userAuthInfo, setUserAuthInfo] = useState<AuthInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    async function loadProfile() {
        try {

            setError(null);

            const authInfo = await loadCurrentUserAuthInfo();
            const userInfo = await loadUserInfo(authInfo.id);

            setUserAuthInfo(authInfo);
            setUserInfo(userInfo);

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
        void loadProfile()
    }, [])


    return (
        <Background
            header={
                <TitleApp text={"Profilo"}/>
            }>
            {isLoading ? (
                <View style={styles.feedbackContainer}>
                    <ActivityIndicator color="#FFFFFF" size="large"/>
                </View>
            ) : !userInfo || !userAuthInfo ? (
                <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackText}>
                        Utente non disponibile
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >

                    <ProfileHeader userInfo={userInfo} authInfo={userAuthInfo} isLoading={false}/>


                    <View style={styles.profileContent}>
                    </View>

                </ScrollView>

            )}


            <View style={styles.logoutContainer}>

                <Pressable
                    style={({pressed}) => [
                        styles.logoutBtn,
                        pressed && styles.logoutBtnPressed
                    ]}

                    onPress={handleLogout}>
                    <Ionicons
                        name="log-out-outline"
                        size={28}
                        color="#ffffff"
                        style={{transform: [{translateX: +3}]}}
                    />
                </Pressable>

            </View>

        </Background>
    );
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        gap: 10,
    },

    profileContent: {
        flex: 1,
    },

    logoutContainer: {
        position: "absolute",
        bottom: 15,
        right: 15,
        width: 58,
    },

    logoutBtn: {
        width: 58,
        height: 58,
        borderRadius: 28,
        backgroundColor: colors.orangeDefault,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.16)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.20,
        shadowRadius: 12,
        elevation: 8,
    },

    logoutBtnPressed: {
        transform: [{scale: 0.98}],
        opacity: 0.9,
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


});