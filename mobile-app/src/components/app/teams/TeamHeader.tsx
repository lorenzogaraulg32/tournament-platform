import {ActivityIndicator, Pressable, StyleSheet, Text, View,} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import HeaderEntity from "../../common/headers/HeaderEntity";
import Logo from "@/src/components/common/Logo";
import type {TeamDetails} from "@/src/services/teams/teamGetService";
import {colors} from "@/src/constants/theme";


type TeamHeaderProps = {
    team: TeamDetails | null;
    isLoading?: boolean;
    error?: string | null;
    onInviteFriendPress: () => void
};

const TEAM_BACKGROUND = require("../../../../assets/images/teaminfoSectionBkg.png");


/**
 *
 * @param team la squadra selezionata
 * @param isLoading se la squadra sta caricando
 * @param error se c'è stato un errore nel caricamento della squadra
 * @param onInviteFriendPress
 * @constructor
 */
export default function TeamHeader({
                                       team,
                                       isLoading = false,
                                       error = null,
                                       onInviteFriendPress,
                                   }: TeamHeaderProps) {


    function formatLocationLabel(location: string): string {
        const parts = location.split(",")
        return parts[0] + "  · " + parts[1] + "  · " + parts[2]
    }


    return (
        <HeaderEntity
            backgroundSource={TEAM_BACKGROUND}
            overlayColor="rgba(31, 10, 2, 0.25)"
            borderColor="rgba(255, 154, 72, 0.25)"
        >
            {isLoading ? (
                <View style={styles.feedbackContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#FFFFFF"
                    />

                    <Text style={styles.feedbackText}>
                        Caricamento squadra...
                    </Text>
                </View>
            ) : error ? (
                <View style={styles.feedbackContainer}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={30}
                        color="#FFFFFF"
                    />

                    <Text style={styles.feedbackText}>
                        {error}
                    </Text>
                </View>
            ) : !team ? (
                <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackText}>
                        Squadra non disponibile
                    </Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.leftContainer}>
                        <View style={styles.imageContainer}>
                            <Logo
                                variant={"team"}
                                logoUrl={team.logoUrl}
                                style={styles.logo}
                            />
                        </View>
                    </View>
                    <View style={styles.verticalSeparator}/>

                    <View style={styles.rightContainer}>
                        <Text
                            style={styles.teamName}
                            numberOfLines={1}
                        >
                            {team.name.toUpperCase()}
                        </Text>

                        <Text
                            style={styles.teamLocation}
                            numberOfLines={1}
                        >
                            {formatLocationLabel(team.locationLabel)}
                        </Text>


                        <View style={styles.badgesContainer}>

                            <InviteFriendBadge
                                label={"Invita nella squadra"}
                                onPress={onInviteFriendPress}
                            />
                        </View>


                    </View>
                </View>
            )}
        </HeaderEntity>
    );
}

type inviteFriendBadgeProps = {
    label: string;
    onPress: () => void;
};

function InviteFriendBadge({
                               label,
                               onPress,
                           }: inviteFriendBadgeProps) {
    return (
        <Pressable
            onPress={onPress}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel={`Apri ${label}`}
            style={({pressed}) => [
                styles.infoBadge,
                pressed && styles.infoBadgePressed,
            ]}
        >
            <View style={styles.infoBadgeIcon}>
                <Ionicons
                    name="share-social-outline"
                    size={16}
                    color="#FFFFFF"
                />
            </View>

            <Text
                style={styles.infoBadgeText}
                numberOfLines={1}
            >
                {label}
            </Text>

            <View style={styles.infoBadgeArrow}>
                <Ionicons
                    name="chevron-forward"
                    size={14}
                    color="#FFFFFF"
                />
            </View>
        </Pressable>
    );
}


//!! L'altezza della card in realtà è legata all'altezza del vertical separator
const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        paddingHorizontal: 14,
        paddingVertical: 10,
        height: 160,

    },

    rightContainer: {
        flex: 1,
        minWidth: 0,
        justifyContent: "center",
        flexDirection: "column",
    },

    leftContainer: {
        flex: 1,
        maxWidth: 95,
        justifyContent: "center",
        flexDirection: "column",
    },

    imageContainer: {
        width: 95,
        height: 95,
        borderRadius: 1000,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#FFFFFF",
        backgroundColor: "#D9D9D9",
    },

    logo: {
        width: "100%",
        height: "100%",
    },

    verticalSeparator: {
        width: 1,
        height: 120,
        marginHorizontal: 14,
        backgroundColor: "rgba(255, 255, 255, 0.24)",
    },


    teamName: {
        color: "#FFFFFF",
        fontSize: 19,
        lineHeight: 27,
        fontWeight: "800",
        letterSpacing: 0.1,
    },

    teamLocation: {
        marginVertical: 6,
        color: colors.textOffWhite,
        fontSize: 12,
    },


    badgesContainer: {
        marginTop: 16,
        gap: 8,
    },

    infoBadge: {
        minWidth: 0,
        flexDirection: "row",
        alignItems: "center",

        paddingLeft: 8,
        paddingRight: 7,
        paddingVertical: 8,

        borderRadius: 14,
        gap: 7,

        backgroundColor: "rgba(255, 255, 255, 0.30)",

        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.38)",

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.12,
        shadowRadius: 3,

        elevation: 2,
    },

    infoBadgeIcon: {
        width: 24,
        height: 24,
        borderRadius: 9,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(255, 255, 255, 0.16)",
    },

    infoBadgeText: {
        flex: 1,
        minWidth: 0,
        flexShrink: 1,

        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "800",
    },

    infoBadgeArrow: {
        width: 20,
        height: 20,
        borderRadius: 10,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(255, 255, 255, 0.16)",
    },

    infoBadgePressed: {
        opacity: 0.78,
        transform: [{scale: 0.97}],
    },


    feedbackContainer: {
        minHeight: 120,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        gap: 10,
    },

    feedbackText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
    },


});