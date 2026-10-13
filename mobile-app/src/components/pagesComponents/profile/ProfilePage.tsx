import {Pressable, ScrollView, StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import {paletteVariants, type Variant,} from "@/src/constants/palette/PaletteManager";
import type {TeamDetails} from "@/src/services/teams/teamDTO";

import PageLayout from "@/src/components/common/layout/PageLayout";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import HeaderEntity from "@/src/components/common/headers/HeaderEntity";
import LoadingSection from "@/src/components/common/loading/LoadingSection";
import ErrorSection from "@/src/components/common/errors/ErrorSection";
import {ActivitiesSection} from "@/src/components/common/ActivitiesSection";
import StandardCardList from "@/src/components/common/layout/StandardCardList";
import TeamCardHorizontal from "@/src/components/common/cards/teamCards/TeamCardHorizontal";
import CollapsableSection from "@/src/components/common/layout/CollapsableSection";
import {ProfileData} from "@/src/components/pagesComponents/profile/ProfileScreen";
import TournamentCardHorizontal from "@/src/components/common/cards/tournamentCards/TournamentCardHorizontal";

type ProfilePageProps = {
    variant: Variant;
    profile: ProfileData | null;
    isOwnProfile?: boolean;
    onLogout: () => void;
    loading: boolean,
    error?: string | null,
    onErrorRetry?: () => void
    canLeaveTeam: (team: TeamDetails) => boolean
    leaveTeam: (team: TeamDetails) => Promise<void>

};

export default function ProfilePage({
                                        variant,
                                        profile,
                                        isOwnProfile,
                                        onLogout,
                                        loading,
                                        error,
                                        onErrorRetry,
                                    }: ProfilePageProps) {
    const {palette} = paletteVariants[variant];

    if (loading) {
        return (
            <PageLayout
                header={
                    <HeaderContainer variant={variant}>
                        <HeaderEntity
                            variant={variant}
                            name={""}
                            image={null}
                            position={null}
                            style={{paddingTop: 45}}
                        />
                    </HeaderContainer>
                }
            >
                <LoadingSection style={{marginTop: 20}} text={"Caricamento profilo..."}/>
            </PageLayout>
        )
    }

    if (error) {
        return (
            <PageLayout
                header={
                    <HeaderContainer variant={variant}>
                        <HeaderEntity
                            variant={variant}
                            name={""}
                            image={null}
                            position={""}
                            style={{paddingTop: 45}}
                        />
                    </HeaderContainer>
                }
            >
                <ErrorSection style={{
                    marginTop: 20
                }} text={error} onRetry={onErrorRetry} variant={"error"}/>

            </PageLayout>
        )
    }

    if (!profile) {
        return null;
    }

    return (
        <PageLayout
            header={
                <HeaderContainer variant={variant}>
                    <HeaderEntity
                        variant={variant}
                        name={`${profile.user.firstName} ${profile.user.lastName}`}
                        image={profile.user.avatar}
                        position={profile.user.location?.label}
                        style={{paddingTop: 45}}
                        email={profile.auth?.email}
                    />
                </HeaderContainer>
            }
        >


            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <ActivitiesSection
                    variant={"profile"}
                    activities={profile.activities}/>

                {/* La sezione delle squadre è visibile solo se non si è nel proprio profilo */}
                {!isOwnProfile &&
                    <CollapsableSection
                        label="Squadre"
                        iconName="shirt-outline"
                    >
                        <StandardCardList
                            items={(profile.teams ?? [])
                                .map(team => {
                                    return (
                                        <TeamCardHorizontal
                                            key={team.id}
                                            teamDetails={team}
                                        />
                                    )
                                })}
                            isLoading={false}
                            error={null}
                            emptyMsg={"Questo utente non fa parte di nessuna squadra"}
                            orientation="vertical"
                        />
                    </CollapsableSection>}


                {/* La sezione dei tornei è visibile solo se non si è nel proprio profilo */}
                {!isOwnProfile &&
                    <CollapsableSection
                        label="Tornei "
                        iconName="shirt-outline"
                    >
                        <StandardCardList
                            items={(profile.tournaments ?? [])
                                .map(tournament => {
                                    return (
                                        <TournamentCardHorizontal
                                            key={tournament.id}
                                            tournament={tournament}
                                        />
                                    )
                                })}
                            isLoading={false}
                            error={null}
                            emptyMsg={"Questo utente non partecipa a nessun torneo"}
                            orientation="vertical"
                        />
                    </CollapsableSection>
                }
            </ScrollView>

            {isOwnProfile && (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Esci dall'account"
                    onPress={onLogout}
                    style={({pressed}) => [
                        styles.logoutButton,
                        {
                            backgroundColor: palette.defaultColor,
                            borderColor: palette.borderColor,
                        },
                        pressed && styles.pressed,
                    ]}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={28}
                        color="#FFFFFF"
                    />
                </Pressable>
            )}
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    scroll: {
        marginTop: 10,
        flex: 1,
    },

    content: {
        gap: 20,
        paddingBottom: 88,
    },
    logoutButton: {
        position: "absolute",
        bottom: 15,
        right: 15,
        width: 58,
        height: 58,
        borderRadius: 29,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    pressed: {
        transform: [{scale: 0.98}],
        opacity: 0.9,
    },

    activityRow: {
        flexDirection: "row",
        gap: 5
    },

});