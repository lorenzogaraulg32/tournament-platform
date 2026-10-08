import {Pressable, ScrollView, StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import {paletteVariants, type Variant,} from "@/src/constants/PaletteManager";
import type {UserInfo} from "@/src/services/users/userDTO";
import type {TeamDetails} from "@/src/services/teams/teamDTO";

import PageLayout from "@/src/components/common/PageLayout";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import HeaderEntity from "@/src/components/common/headers/HeaderEntity";
import LoadingSection from "@/src/components/common/loading/LoadingSection";
import ErrorSection from "@/src/components/common/errors/ErrorSection";
import {AuthInfo} from "@/src/services/users/authService";

type ProfilePageProps = {
    variant: Variant;
    user?: UserInfo;
    auth?: AuthInfo
    userTeams?: TeamDetails[];
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
                                        user,
                                        auth,
                                        userTeams,
                                        isOwnProfile,
                                        onLogout,
                                        loading,
                                        error,
                                        onErrorRetry,
                                        canLeaveTeam,
                                        leaveTeam
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

    if (!user) {
        return null;
    }

    return (
        <PageLayout
            header={
                <HeaderContainer variant={variant}>
                    <HeaderEntity
                        variant={variant}
                        name={`${user.firstName} ${user.lastName}`}
                        image={user.avatar}
                        position={user.location?.label}
                        style={{paddingTop: 45}}
                        email={auth?.email}
                    />
                </HeaderContainer>
            }
        >


            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                {/* <CollapsableSection
                    label="Squadre"
                    iconName="shirt-outline"
                    canMod={isOwnProfile}
                >
                    {(isMod) => {
                        const canLeave = isMod && isOwnProfile
                        return (
                            <CardListContainer
                                items={(userTeams ?? [])
                                    .filter(team => !isMod || canLeaveTeam(team))
                                    .map(team => {

                                        return (
                                            <TeamCardHorizontal
                                                key={team.id}
                                                teamDetails={team}
                                                onLeave={
                                                    canLeave ? () => void leaveTeam(team) : undefined
                                                }
                                            />
                                        )
                                    })}
                                isLoading={false}
                                error={null}
                                emptyMsg={
                                    isMod ? "Nessuna squadra che puoi abbandonare"
                                        : "Questo utente non fa parte di nessuna squadra"
                                }
                                orientation="vertical"
                            />
                        )
                    }
                    }

                </CollapsableSection>
                */}
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
        gap: 10,
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
});