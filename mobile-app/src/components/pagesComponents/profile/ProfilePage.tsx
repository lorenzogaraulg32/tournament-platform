import {useCallback, useEffect, useRef, useState} from "react";
import {AuthInfo, handleLogout, loadUserAuthInfo} from "@/src/services/users/authService";
import {loadUserInfo, UserInfo} from "@/src/services/users/userService";
import PageLayout from "@/src/components/common/PageLayout";
import {Pressable, ScrollView, StyleSheet, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {colors} from "@/src/constants/theme";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {fetchUserTeams} from "@/src/services/teams/teamService";
import CardListContainer from "@/src/components/common/carousel&cards/CardListContainer";
import TeamCardVertical from "@/src/components/pagesComponents/teams/cards/TeamCardVertical";
import CollapsableSection from "@/src/components/common/CollapsableSection";
import {router} from "expo-router";
import HeaderEntity from "@/src/components/common/headers/HeaderEntity";
import {TeamDetails} from "@/src/services/teams/teamsConst";

type ProfilePageProps = {
    userId: string;
    isOwnProfile: boolean
};

export default function ProfilePage({userId, isOwnProfile}: ProfilePageProps) {

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [userAuthInfo, setUserAuthInfo] = useState<AuthInfo | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userTeams, setUserTeams] = useState<TeamDetails[]>([])
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
                    fetchUserTeams(userId)
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

    const onBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(app)/home");
        }
    };

    const onDelete = () => {
        console.log("Delete premuto")
    }

    const onMod = () => {
        router.push({
            pathname: "/profile/modify",
        });
    }

    useEffect(() => {
        void loadProfile();

        return () => {
            requestIdRef.current++;
        };
    }, [loadProfile]);

    return (
        <PageLayout
            header={
                <HeaderContainer
                    variant={"profile"}
                    onBack={onBack}
                    canEdit={isOwnProfile}
                    onMod={onMod}
                    onDelete={onDelete}
                >
                    <HeaderEntity
                        variant={"player"}
                        entity={userInfo}
                        isLoading={isLoading}
                        error={error}
                    />
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
                                    <CollapsableSection label={"Squadre"} iconName={"shirt-outline"}>
                                        <CardListContainer
                                            items={userTeams?.map((team) => (
                                                <TeamCardVertical
                                                    key={team.id}
                                                    teamDetails={team}/>
                                            ))}
                                            isLoading={isLoading}
                                            emptyMsg={"Crea una squadra oppure\n unisciti tramite il codice d'invito"}
                                            error={error}
                                            orientation={"horizontal"}
                                        />
                                    </CollapsableSection>
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