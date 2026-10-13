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

//Autorità attuali
export type Authority = "ADMIN" | "OWNER";
export const authorityCardPalettes: Record<Authority, CompactCardPalette> = {
    ADMIN: adminCardColors,
    OWNER: ownerCardColors,
};

