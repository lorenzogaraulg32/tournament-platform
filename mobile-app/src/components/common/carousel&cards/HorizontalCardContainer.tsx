import {ReactNode} from "react";
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {SportRole} from "@/src/services/users/userConstants";
import {
    adminCardColors,
    blueRoleCardColors,
    CardBackground,
    CompactCardPalette,
    greenRoleCardColors,
    ownerCardColors,
    redRoleCardColors,
    tealRoleCardColors,
    teamCardColors,
    tournamentCardColors,
    yellowRoleCardColors
} from "@/src/constants/cardPalettes";

type HorizontalCardContainerProps = {
    onPress: () => void,
    variant: "team" | "tournament" | "user" | "authority"
    children: ReactNode,
    style?: StyleProp<ViewStyle>
    role?: SportRole
    authority?: TeamAuthority
}


export default function HorizontalCardContainer({
                                                    onPress,
                                                    variant,
                                                    children,
                                                    style,
                                                    role,
                                                    authority
                                                }:
                                                    HorizontalCardContainerProps) {


    function renderBK() {

        if (variant === "tournament") {
            return <TournamentCardBK/>;
        }

        if (variant === "team") {
            return <TeamCardBK/>;
        }

        if (variant === "authority" && authority) {
            return <AuthorityCardBK authority={authority}/>
        }

        if (variant === "user" && role) {
            return <PlayerCardBK role={role}/>;
        }

        return null;
    }

    function getPalette() {


        if (variant === "team") {
            return teamCardColors;
        }

        if (variant === "tournament") {
            return tournamentCardColors;
        }

        if (variant === "authority" && authority) {
            return authorityCardPalettes[authority]
        }

        if (variant === "user" && role) {
            return roleCardPalettes[role];
        }

        return teamCardColors;
    }

    const palette = getPalette();


    return (
        <Pressable
            style={({pressed}) => [
                (style && style) || styles.card,
                pressed && styles.cardPressed,
            ]}
            onPress={onPress}
        >
            {renderBK()}
            {children}
            <View
                style={[
                    styles.arrowContainer,
                    {
                        backgroundColor: palette.accentBackground,
                    },
                ]}
            >
                <Ionicons
                    name="chevron-forward"
                    size={17}
                    color={palette.accent}
                />
            </View>

        </Pressable>
    )
}


function TournamentCardBK() {
    return <CardBackground palette={tournamentCardColors}/>;
}

function TeamCardBK() {
    return <CardBackground palette={teamCardColors}/>;
}


/* Varianti per gli sfondi delle card utente */
export const roleCardPalettes: Record<SportRole, CompactCardPalette> = {
    // Calcio
    [SportRole.GOALKEEPER]: yellowRoleCardColors,
    [SportRole.DEFENDER]: greenRoleCardColors,
    [SportRole.MIDFIELDER]: blueRoleCardColors,
    [SportRole.FORWARD]: redRoleCardColors,
    [SportRole.FILL_FB]: tealRoleCardColors,

    // Beach volley
    [SportRole.BLOCKER]: yellowRoleCardColors,
    [SportRole.BEACH_DEFENDER]: greenRoleCardColors,
    [SportRole.FILL_BV]: tealRoleCardColors,

    // Basket
    [SportRole.POINT_GUARD]: blueRoleCardColors,
    [SportRole.SHOOTING_GUARD]: redRoleCardColors,
    [SportRole.SMALL_FORWARD]: tealRoleCardColors,
    [SportRole.POWER_FORWARD]: greenRoleCardColors,
    [SportRole.CENTER]: yellowRoleCardColors,
    [SportRole.FILL_BK]: tealRoleCardColors,
};
type PlayerCardBKProps = {
    role: SportRole;
};

function PlayerCardBK({role}: PlayerCardBKProps) {
    return (
        <CardBackground
            palette={roleCardPalettes[role]}
            compact
        />
    );
}

/* Varianti per gli sfondi delle card utente amministrative*/
export type TeamAuthority = "ADMIN" | "OWNER";
export const authorityCardPalettes: Record<TeamAuthority, CompactCardPalette> = {
    ADMIN: adminCardColors,
    OWNER: ownerCardColors,
};
type AuthorityCardBKProps = {
    authority: TeamAuthority;
};

function AuthorityCardBK({authority,}: AuthorityCardBKProps) {
    return (
        <CardBackground
            palette={authorityCardPalettes[authority]}
            compact
        />
    );
}


const styles = StyleSheet.create({
    card: {
        position: "relative",
        width: "100%",
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
    },

    cardPressed: {
        opacity: 0.9,
        transform: [{scale: 0.985}],
    },


    arrowContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginLeft: 8,
        alignItems: "center",
        justifyContent: "center",
    },
});