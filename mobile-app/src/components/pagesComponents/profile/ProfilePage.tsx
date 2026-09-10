import HeaderProfile from "@/src/components/pagesComponents/profile/HeaderProfile";
import {useCallback, useEffect, useRef, useState} from "react";
import {AuthInfo, handleLogout, loadUserAuthInfo} from "@/src/services/users/authService";
import {loadUserInfo, UserInfo} from "@/src/services/users/userService";
import PageLayout from "@/src/components/common/PageLayout";
import {Pressable, ScrollView, StyleSheet, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {colors} from "@/src/constants/theme";
import InfoLabel from "@/src/components/common/labels/InfoLabel";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {loadUserTeams, TeamInfo} from "@/src/services/teams/teamService";
import CarouselContainer from "@/src/components/common/carousel&cards/CarouselContainer";
import TeamCardVertical from "@/src/components/pagesComponents/teams/TeamCardVertical";
import LoadingSection from "@/src/components/common/loading/LoadingSection";
import ErrorSection from "@/src/components/common/errors/ErrorSection";

type ProfilePageProps = {
    userId: string;
    isOwnProfile: boolean
};

export default function ProfilePage({userId, isOwnProfile}: ProfilePageProps) {

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [userAuthInfo, setUserAuthInfo] = useState<AuthInfo | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userTeams, setUserTeams] = useState<TeamInfo[]>([])
    const requestIdRef = useRef(0);


    const loadProfile = useCallback(async () => {

        const requestId = ++requestIdRef.current;
        try {
            setLoading(true);
            setError(null);

            const [authInfo, profileInfo, teams] =
                await Promise.all([
                    loadUserAuthInfo(userId),
                    loadUserInfo(userId),
                    loadUserTeams(userId)
                ]);


            if (requestId !== requestIdRef.current) {
                return;
            }

            setUserAuthInfo(authInfo);
            setUserInfo(profileInfo);
            setUserTeams(teams)
        } catch (error) {

            if (requestId !== requestIdRef.current) {
                return;
            }
            const apiError =
                normalizeApiRequestError(error);

            if (apiError.status !== 401) {
                setError(apiError.message);
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, [userId])

    useEffect(() => {
        void loadProfile();

        return () => {
            requestIdRef.current++;
        };
    }, [loadProfile]);


    console.log("ProfilePage", { userId, isOwnProfile });

    return (
        <PageLayout
            header={
                <HeaderContainer variant={"profile"}>
                    {isLoading ? (
                        <LoadingSection text={"Caricamento profilo..."}/>
                    ) : error ? (
                        <ErrorSection text={error} onRetry={loadProfile} variant={"error"}/>

                    ) : !userInfo || !userAuthInfo ? (
                        <ErrorSection text={"Utente non disponibile"} variant={"warning"}/>

                    ) : (
                        <HeaderProfile
                            userInfo={userInfo}
                            authInfo={userAuthInfo}
                            canEdit={isOwnProfile}
                        />
                    )}
                </HeaderContainer>}>

            {userInfo &&
                <View style={styles.profileContainer}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.profileContent}>
                            {!isOwnProfile ? (
                                <View style={styles.section}>
                                    <InfoLabel text={"Squadre"} labelIconName={"shirt-outline"}/>
                                    <CarouselContainer
                                        items={userTeams?.map((team) => (
                                            <TeamCardVertical
                                                key={team.id}
                                                teamDetails={team}/>
                                        ))}
                                        isLoading={isLoading}
                                        emptyMsg={"Crea una squadra oppure\n unisciti tramite il codice d'invito"}
                                        error={error}
                                    />
                                </View>
                            ) : (
                                <View>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                </View>
            }

            {isOwnProfile && <View style={styles.logoutContainer}>

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
            }

        </PageLayout>
    )

}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginTop: -26,
        paddingTop: 36,
        paddingBottom: 20,
        zIndex: -1,
    },

    scrollContent: {
        gap: 10,
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


});