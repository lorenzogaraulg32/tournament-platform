import {Pressable, ScrollView, StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import {paletteVariants, type Variant,} from "@/src/constants/PaletteManager";
import type {UserInfo} from "@/src/services/users/userDTO";
import type {TeamDetails} from "@/src/services/teams/teamDTO";

import PageLayout from "@/src/components/common/PageLayout";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import HeaderEntity from "@/src/components/common/headers/HeaderEntity";
import CollapsableSection from "@/src/components/common/CollapsableSection";
import CardListContainer from "@/src/components/common/carousel&cards/CardListContainer";
import TeamCardVertical from "@/src/components/common/carousel&cards/teamCards/TeamCardVertical";
import LoadingSection from "@/src/components/common/loading/LoadingSection";
import ErrorSection from "@/src/components/common/errors/ErrorSection";

type ProfilePageProps = {
    variant: Variant;
    user?: UserInfo;
    userTeams?: TeamDetails[];
    isOwnProfile?: boolean;
    onLogout: () => void;
    loading: boolean,
    error?: string | null,
    onErrorRetry?: () => void
};

export default function ProfilePage({
                                        variant,
                                        user,
                                        userTeams,
                                        isOwnProfile,
                                        onLogout,
                                        loading,
                                        error,
                                        onErrorRetry
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
        )}

    if(!user){
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
                    />
                </HeaderContainer>
            }
        >


            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {!isOwnProfile && (
                    <CollapsableSection
                        label="Squadre"
                        iconName="shirt-outline"
                    >
                        <CardListContainer
                            items={userTeams?.map(team => (
                                <TeamCardVertical
                                    key={team.id}
                                    teamDetails={team}
                                />
                            ))}
                            isLoading={false}
                            error={null}
                            emptyMsg="Questo utente non fa parte di nessuna squadra"
                            orientation="horizontal"
                        />
                    </CollapsableSection>
                )}
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