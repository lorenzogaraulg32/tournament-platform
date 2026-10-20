import {Pressable, StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import {paletteVariants, type Variant,} from "@/src/constants/palette/PaletteManager";
import EntityHeader from "@/src/components/common/layout/headers/EntityHeader";
import LoadingSection from "@/src/components/common/loading/LoadingSection";
import ErrorSection from "@/src/components/common/errors/ErrorSection";
import {ActivitiesSection} from "@/src/components/common/ActivitiesSection";
import StandardCardList from "@/src/components/common/StandardCardList";
import TeamCardHorizontal from "@/src/components/common/cards/teamCards/TeamCardHorizontal";
import CollapsableSection from "@/src/components/common/CollapsableSection";
import TournamentCardHorizontal from "@/src/components/common/cards/tournamentCards/TournamentCardHorizontal";
import {ProfileData} from "@/src/services/users/userService";
import {ReactNode} from "react";
import EntityLayout from "@/src/components/common/layout/EntityLayout";

type ProfilePageProps = {
    variant: Variant;
    profile: ProfileData | null;
    isOwnProfile?: boolean;
    onLogout: () => void;
    loading: boolean,
    error?: string | null,
    onErrorRetry?: () => void
    backBtn?: ReactNode,
    optionsBtn?: ReactNode
};

export default function ProfilePage({
                                        variant,
                                        profile,
                                        isOwnProfile,
                                        onLogout,
                                        loading,
                                        error,
                                        onErrorRetry,
                                        backBtn,
                                        optionsBtn
                                    }: ProfilePageProps) {
    const {palette} = paletteVariants[variant];

    if (loading) {
        return (
            <EntityLayout
                header={
                    <EntityHeader
                        variant={variant}
                        name={""}
                        image={null}
                        position={null}
                        backBtn={backBtn}

                    />
                }
            >
                <LoadingSection style={{marginTop: 20}} text={"Caricamento profilo..."}/>
            </EntityLayout>
        )
    }

    if (error) {
        return (
            <EntityLayout
                header={
                    <EntityHeader
                        variant={variant}
                        name={""}
                        image={null}
                        position={""}
                        backBtn={backBtn}
                    />
                }
            >
                <ErrorSection style={{
                    marginTop: 20
                }} text={error} onRetry={onErrorRetry} variant={"error"}/>

            </EntityLayout>
        )
    }

    if (!profile) {
        return null;
    }

    return (
        <EntityLayout
            header={
                <EntityHeader
                    variant={variant}
                    name={`${profile.user.firstName} ${profile.user.lastName}`}
                    image={profile.user.avatar}
                    position={profile.user.location?.label}
                    email={profile.auth?.email}
                    backBtn={backBtn}
                    optionsBtn={optionsBtn}
                />
            }
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
                                        teamDetails={team}/>
                                );
                            })}
                        isLoading={false}
                        error={null}
                        emptyMsg={"Questo utente non fa parte di nessuna squadra"}
                        orientation="vertical"/>
                </CollapsableSection>

            }

            {/* La sezione dei tornei è visibile solo se non si è nel proprio profilo */}
            {!isOwnProfile &&

                <CollapsableSection
                    label="Tornei "
                    iconName="trophy-outline"
                >
                    <StandardCardList
                        items={(profile.managedTournaments ?? [])
                            .map(tournament => {
                                return (
                                    <TournamentCardHorizontal
                                        key={tournament.id}
                                        tournament={tournament}/>
                                );
                            })}
                        isLoading={false}
                        error={null}
                        emptyMsg={"Questo utente non gestisce nessun torneo"}
                        orientation="vertical"/>
                </CollapsableSection>


            }

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
        </EntityLayout>
    );
}

const styles = StyleSheet.create({


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