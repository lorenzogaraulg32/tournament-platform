import {ImageSourcePropType, StyleSheet, View} from "react-native";
import {teamCardBlueColors, tournamentCardColors5} from "@/src/constants/theme";

export type ColorVariant = | "home" | "teams" | "tournaments" | "profile";

export type VariantConfig = {
    background: ImageSourcePropType;
};

export const variants: Record<ColorVariant, VariantConfig> = {

    home: {
        background: require("../../assets/images/backgrounds/greenBackground.png"),
    },

    teams: {
        background: require("../../assets/images/backgrounds/orangeBackground.png"),
    },

    tournaments: {
        background: require("../../assets/images/backgrounds/purpleBackground.png"),
    },

    profile: {
        background: require("../../assets/images/backgrounds/redBackground.png"),
    },

};

type CardPalette = typeof teamCardBlueColors;

function CardBackground({palette}: {palette: CardPalette}) {
    return (
        <View
            pointerEvents="none"
            style={[
                styles.background,
                {
                    backgroundColor: palette.background,
                    borderColor: palette.border,
                },
            ]}
        >
            <View
                style={[
                    styles.glowLeft,
                    {backgroundColor: palette.glowLeft},
                ]}
            />
            <View
                style={[
                    styles.glowRight,
                    {backgroundColor: palette.glowRight},
                ]}
            />
            <View
                style={[
                    styles.diagonalLineOne,
                    {backgroundColor: palette.diagonalPrimary},
                ]}
            />
            <View
                style={[
                    styles.diagonalLineTwo,
                    {backgroundColor: palette.diagonalAccent},
                ]}
            />
            <View
                style={[
                    styles.diagonalLineThree,
                    {backgroundColor: palette.diagonalSecondary},
                ]}
            />
            <View
                style={[
                    styles.rightBrush,
                    {backgroundColor: palette.brush},
                ]}
            />
            <View
                style={[
                    styles.accentLine,
                    {backgroundColor: palette.yellowAccent},
                ]}
            />
        </View>
    );
}

export function TeamCardBK() {
    return <CardBackground palette={teamCardBlueColors} />;
}

export function TournamentCardBK() {
    return <CardBackground palette={tournamentCardColors5} />;
}


const styles = StyleSheet.create({
    background: {
        ...StyleSheet.absoluteFill,
        overflow: "hidden",
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.16,
        shadowRadius: 6,
    },


    glowLeft: {
        position: "absolute",
        left: -65,
        top: -55,
        width: 170,
        height: 170,
        borderRadius: 85,
    },

    glowRight: {
        position: "absolute",
        right: -80,
        bottom: -100,
        width: 210,
        height: 210,
        borderRadius: 105,
    },

    diagonalLineOne: {
        position: "absolute",
        right: 35,
        top: -50,
        width: 12,
        height: 190,
        transform: [{rotate: "28deg"}],
    },

    diagonalLineTwo: {
        position: "absolute",
        right: 68,
        top: -45,
        width: 4,
        height: 180,
        transform: [{rotate: "28deg"}],
    },

    diagonalLineThree: {
        position: "absolute",
        right: 100,
        top: -45,
        width: 2,
        height: 180,
        transform: [{rotate: "28deg"}],
    },

    rightBrush: {
        position: "absolute",
        right: -30,
        bottom: -45,
        width: 165,
        height: 85,
        borderRadius: 50,
        transform: [
            {rotate: "-12deg"},
            {scaleX: 1.3},
        ],
    },

    accentLine: {
        position: "absolute",
        left: 0,
        top: 20,
        bottom: 20,
        width: 4,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },

})
