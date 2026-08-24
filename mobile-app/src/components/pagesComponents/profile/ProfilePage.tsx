import HeaderProfile from "@/src/components/pagesComponents/profile/HeaderProfile";
import {useEffect, useState} from "react";
import {AuthInfo, handleLogout, loadUserAuthInfo} from "@/src/services/users/authService";
import {loadUserInfo, UserInfo} from "@/src/services/users/userService";
import PageLayout from "@/src/components/common/PageLayout";
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {colors} from "@/src/constants/theme";
import InfoLabel from "@/src/components/common/labels/infoLabel";
import TeamCarousel from "@/src/components/common/HorizontalCarousel";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";

type ProfilePageProps = {
    userId: string;
    teams?: boolean
};

export default function ProfilePage({userId, teams}: ProfilePageProps) {

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [userAuthInfo, setUserAuthInfo] = useState<AuthInfo | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadProfile() {
        try {
            setLoading(true);
            setError(null);


            const authInfo = await loadUserAuthInfo(userId);


            const userInfo = await loadUserInfo("1");


            setUserAuthInfo(authInfo);
            setUserInfo(userInfo);

        } catch (error) {


            setError("Impossibile caricare le info dell'utente");

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!userId) {
            return;
        }

        void loadProfile();
    }, [])


    return (
        <PageLayout
            header={
            <HeaderContainer variant={"red"}>
                {isLoading ? (
                    <View >
                        <ActivityIndicator color="#FFFFFF" size="large"/>
                    </View>
                ) : error ? (
                    <View>
                        <Text style={styles.feedbackText}>
                            {error}
                        </Text>
                    </View>
                ) : !userInfo || !userAuthInfo ? (
                    <View>
                        <Text style={styles.feedbackText}>
                            Utente non disponibile
                        </Text>
                    </View>
                ) : (
                    <HeaderProfile
                        userInfo={userInfo}
                        authInfo={userAuthInfo}
                        isLoading={false}
                    />
                )}
            </HeaderContainer>}>

            <View style={styles.profileContainer}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.profileContent}>
                        {teams && userInfo ? (
                            <View style={styles.section}>
                                <InfoLabel text={"Squadre"} labelIconName={"shirt-outline"}/>
                                <TeamCarousel
                                    transparent
                                    style={styles.teamCarousel}
                                    inputEntity={{
                                        id: userId,
                                        userInfo: userInfo
                                    }}
                                    variant="teams"
                                />
                            </View>
                        ) : (
                            <View>
                            </View>
                        )}
                    </View>
                </ScrollView>

            </View>
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

        </PageLayout>
    );
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginTop: -26,
        paddingTop: 36,
        paddingHorizontal: 10,
        paddingBottom: 20,
        backgroundColor: "#ffffff",
        zIndex: -1,
    },

    scrollContent: {
        gap: 10,
        backgroundColor: "#ffffff"
    },


    profileContainer: {
        flex: 1,
    },

    headerContainer: {
        zIndex: 2,
    },

    profileContent: {
        flex: 1,
    },

    section: {
        gap: 4,
    },


    teamCarousel: {
        marginHorizontal: 0,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderRadius: 0,
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

    feedbackText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "500",
        textAlign: "center",
    },


});