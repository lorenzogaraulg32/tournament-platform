import {StyleSheet, View} from "react-native";

export function CardBackground({
                                   palette,
                                   compact = false,
                               }: {
    palette: CardBackgroundPalette;
    compact?: boolean;
}) {
    return (
        <View
            pointerEvents="none"
            style={[
                cardPaletteStyles.background,
                compact && compactCardPaletteStyles.compactBackground,
                {
                    backgroundColor: palette.background,
                    borderColor: palette.border,
                },
            ]}
        >
            <View
                style={[
                    cardPaletteStyles.glowLeft,
                    compact && compactCardPaletteStyles.compactGlowLeft,
                    {backgroundColor: palette.glowLeft},
                ]}
            />

            <View
                style={[
                    cardPaletteStyles.glowRight,
                    compact && compactCardPaletteStyles.compactGlowRight,
                    {backgroundColor: palette.glowRight},
                ]}
            />

            <View
                style={[
                    cardPaletteStyles.diagonalLineOne,
                    compact && compactCardPaletteStyles.compactDiagonalOne,
                    {backgroundColor: palette.diagonalPrimary},
                ]}
            />

            <View
                style={[
                    cardPaletteStyles.diagonalLineTwo,
                    compact && compactCardPaletteStyles.compactDiagonalTwo,
                    {backgroundColor: palette.diagonalAccent},
                ]}
            />

            <View
                style={[
                    cardPaletteStyles.diagonalLineThree,
                    compact && compactCardPaletteStyles.compactDiagonalThree,
                    {backgroundColor: palette.diagonalSecondary},
                ]}
            />

            <View
                style={[
                    cardPaletteStyles.rightBrush,
                    compact && compactCardPaletteStyles.compactBrush,
                    {backgroundColor: palette.brush},
                ]}
            />

            <View
                style={[
                    cardPaletteStyles.accentLine,
                    compact && compactCardPaletteStyles.compactAccentLine,
                    {backgroundColor: palette.accent},
                ]}
            />
        </View>
    );
}


//Card grandi per team e tornei
export type CardBackgroundPalette = {
    background: string;
    border: string;
    glowLeft: string;
    glowRight: string;
    diagonalPrimary: string;
    diagonalAccent: string;
    diagonalSecondary: string;
    brush: string;
    accent: string;
    accentBackground: string,
};

export const teamCardColors = {
    background: "#071D35",
    backgroundLight: "#0B2E52",

    border: "rgba(47, 153, 255, 0.38)",

    glowLeft: "rgba(0, 132, 255, 0.18)",
    glowRight: "rgba(0, 196, 255, 0.10)",

    diagonalPrimary: "rgba(255, 255, 255, 0.045)",
    diagonalAccent: "rgba(62, 176, 255, 0.13)",
    diagonalSecondary: "rgba(255, 255, 255, 0.07)",

    brush: "rgba(0, 102, 204, 0.22)",

    logoBackground: "rgba(255, 255, 255, 0.09)",
    logoBorder: "rgba(120, 194, 255, 0.22)",

    title: "#FFFFFF",
    secondaryText: "#A9C8E3",

    accent: "#FFD54A",
    accentBackground: "rgba(255, 213, 74, 0.10)",
};

export const tournamentCardColors = {
    background: "#350F19",
    backgroundLight: "#531725",

    border: "rgba(255, 83, 112, 0.40)",

    glowLeft: "rgba(245, 35, 76, 0.22)",
    glowRight: "rgba(255, 105, 135, 0.12)",

    diagonalPrimary: "rgba(255, 255, 255, 0.045)",
    diagonalAccent: "rgba(255, 95, 124, 0.17)",
    diagonalSecondary: "rgba(255, 255, 255, 0.07)",

    brush: "rgba(210, 25, 61, 0.25)",

    logoBackground: "rgba(255, 255, 255, 0.09)",
    logoBorder: "rgba(255, 155, 175, 0.26)",

    title: "#FFFFFF",
    secondaryText: "#E6B8C2",

    accent: "#FF6685",
    accentBackground: "rgba(255, 102, 133, 0.12)",
};


//Card compatte per gli utenti
export type CompactCardPalette = CardBackgroundPalette & {
    title: string;
    badgeBackground: string;
    badgeBorder: string;
    badgeText: string;
};

export const yellowRoleCardColors: CompactCardPalette = {
    background: "#4A3B05",
    border: "rgba(255, 213, 74, 0.40)",

    glowLeft: "rgba(255, 193, 7, 0.16)",
    glowRight: "rgba(255, 224, 102, 0.10)",

    diagonalPrimary: "rgba(255, 255, 255, 0.045)",
    diagonalAccent: "rgba(255, 213, 74, 0.16)",
    diagonalSecondary: "rgba(255, 255, 255, 0.07)",

    brush: "rgba(255, 193, 7, 0.13)",
    accent: "#FFD54A",

    title: "#FFFFFF",

    badgeBackground: "rgba(255, 213, 74, 0.12)",
    badgeBorder: "#FFD54A",
    badgeText: "#FFE680",

    accentBackground: "rgba(255, 213, 74, 0.14)",

};

export const greenRoleCardColors: CompactCardPalette = {
    background: "#073D2A",
    border: "rgba(53, 208, 127, 0.38)",

    glowLeft: "rgba(22, 163, 74, 0.17)",
    glowRight: "rgba(53, 208, 127, 0.10)",

    diagonalPrimary: "rgba(255, 255, 255, 0.045)",
    diagonalAccent: "rgba(53, 208, 127, 0.16)",
    diagonalSecondary: "rgba(255, 255, 255, 0.07)",

    brush: "rgba(34, 197, 94, 0.13)",
    accent: "#35D07F",

    title: "#FFFFFF",

    badgeBackground: "rgba(53, 208, 127, 0.12)",
    badgeBorder: "#35D07F",
    badgeText: "#69E5A3",

    accentBackground: "rgba(53, 208, 127, 0.14)",
};

export const blueRoleCardColors: CompactCardPalette = {
    background: "#082F63",
    border: "rgba(63, 169, 255, 0.40)",

    glowLeft: "rgba(37, 99, 235, 0.18)",
    glowRight: "rgba(56, 189, 248, 0.10)",

    diagonalPrimary: "rgba(255, 255, 255, 0.045)",
    diagonalAccent: "rgba(63, 169, 255, 0.17)",
    diagonalSecondary: "rgba(255, 255, 255, 0.07)",

    brush: "rgba(37, 99, 235, 0.15)",
    accent: "#3FA9FF",

    title: "#FFFFFF",

    badgeBackground: "rgba(63, 169, 255, 0.12)",
    badgeBorder: "#3FA9FF",
    badgeText: "#75C3FF",

    accentBackground: "rgba(63, 169, 255, 0.14)",

};

export const redRoleCardColors: CompactCardPalette = {
    background: "#5A1420",
    border: "rgba(255, 90, 107, 0.40)",

    glowLeft: "rgba(220, 38, 38, 0.17)",
    glowRight: "rgba(255, 90, 107, 0.11)",

    diagonalPrimary: "rgba(255, 255, 255, 0.045)",
    diagonalAccent: "rgba(255, 90, 107, 0.17)",
    diagonalSecondary: "rgba(255, 255, 255, 0.07)",

    brush: "rgba(220, 38, 38, 0.14)",
    accent: "#FF5A6B",

    title: "#FFFFFF",

    badgeBackground: "rgba(255, 90, 107, 0.12)",
    badgeBorder: "#FF5A6B",
    badgeText: "#FF8995",

    accentBackground: "rgba(255, 90, 107, 0.14)",

};

export const tealRoleCardColors: CompactCardPalette = {
    background: "#08474C",
    border: "rgba(57, 213, 216, 0.40)",

    glowLeft: "rgba(13, 148, 136, 0.18)",
    glowRight: "rgba(57, 213, 216, 0.10)",

    diagonalPrimary: "rgba(255, 255, 255, 0.045)",
    diagonalAccent: "rgba(57, 213, 216, 0.17)",
    diagonalSecondary: "rgba(255, 255, 255, 0.07)",

    brush: "rgba(20, 184, 166, 0.14)",
    accent: "#39D5D8",

    title: "#FFFFFF",

    badgeBackground: "rgba(57, 213, 216, 0.12)",
    badgeBorder: "#39D5D8",
    badgeText: "#72E4E6",

    accentBackground: "rgba(57, 213, 216, 0.14)",
};

export const adminCardColors: CompactCardPalette = {
    background: "#252A31",
    border: "rgba(174, 184, 196, 0.35)",

    glowLeft: "rgba(100, 116, 139, 0.16)",
    glowRight: "rgba(203, 213, 225, 0.08)",

    diagonalPrimary: "rgba(255, 255, 255, 0.045)",
    diagonalAccent: "rgba(174, 184, 196, 0.14)",
    diagonalSecondary: "rgba(255, 255, 255, 0.07)",

    brush: "rgba(148, 163, 184, 0.11)",
    accent: "#AEB8C4",

    title: "#FFFFFF",

    badgeBackground: "rgba(174, 184, 196, 0.12)",
    badgeBorder: "#AEB8C4",
    badgeText: "#D8DEE6",

    accentBackground: "rgba(174, 184, 196, 0.13)",

};

export const ownerCardColors: CompactCardPalette = {
    background: "#3A3E45",
    border: "rgba(240, 243, 247, 0.48)",

    glowLeft: "rgba(226, 232, 240, 0.13)",
    glowRight: "rgba(255, 255, 255, 0.08)",

    diagonalPrimary: "rgba(255, 255, 255, 0.055)",
    diagonalAccent: "rgba(240, 243, 247, 0.17)",
    diagonalSecondary: "rgba(255, 255, 255, 0.09)",

    brush: "rgba(226, 232, 240, 0.12)",
    accent: "#F0F3F7",

    title: "#FFFFFF",

    badgeBackground: "#F0F3F7",
    badgeBorder: "#FFFFFF",
    badgeText: "#333840",

    accentBackground: "rgba(240, 243, 247, 0.15)",

};


//stili delle card
const cardPaletteStyles = StyleSheet.create({
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

const compactCardPaletteStyles = StyleSheet.create({
    compactBackground: {
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

    compactAccentLine: {
        top: 9,
        bottom: 9,
    },

    compactGlowLeft: {
        left: -35,
        top: -42,
        width: 110,
        height: 110,
        borderRadius: 55,
    },

    compactGlowRight: {
        right: -45,
        bottom: -55,
        width: 130,
        height: 130,
        borderRadius: 65,
    },

    compactDiagonalOne: {
        top: -35,
        height: 120,
        width: 9,
    },

    compactDiagonalTwo: {
        top: -32,
        height: 110,
        width: 3,
    },

    compactDiagonalThree: {
        top: -32,
        height: 110,
    },

    compactBrush: {
        right: -24,
        bottom: -35,
        width: 120,
        height: 60,
    },

})

