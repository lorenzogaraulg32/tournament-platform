import type {ImageSourcePropType, TextStyle} from "react-native";
import {colors, fonts} from "./theme";

export type Variant = "home" | "teams" | "tournaments" | "profile" | "onBoarding";

export type StandardPalette = {
    labelFontSize: number;
    labelFontWeight: TextStyle["fontWeight"];
    labelColor: string;
    labelSecondaryColor: string;
};

export type VariantPalette = StandardPalette & {
    borderColor: string;
    defaultColor: string;
    defaultColorBK: string;
};

export type VariantConfig = {
    background: ImageSourcePropType;
    placeholder?: ImageSourcePropType;
    palette: VariantPalette;
};

// Stili condivisi da tutte le varianti.
export const standardPalette: StandardPalette = {
    labelFontSize: fonts.label,
    labelFontWeight: fonts.labelWeight,
    labelColor: colors.label,
    labelSecondaryColor: colors.labelSecondary,
};

export const HomePalette: VariantPalette = {
    ...standardPalette,
    borderColor: colors.greenBorder,
    defaultColor: colors.greenDefault,
    defaultColorBK: colors.greenBK,
};

export const TeamsPalette: VariantPalette = {
    ...standardPalette,
    borderColor: colors.orangeBorder,
    defaultColor: colors.orangeDefault,
    defaultColorBK: colors.orangeDefaultBK,
};

export const TournamentsPalette: VariantPalette = {
    ...standardPalette,
    borderColor: colors.purpleBorder,
    defaultColor: colors.purpleDefault,
    defaultColorBK: colors.purpleBK,
};

export const ProfilePalette: VariantPalette = {
    ...standardPalette,
    borderColor: colors.redBorder,
    defaultColor: colors.redDefault,
    defaultColorBK: colors.redDefaultBK,
};

export const OnBoardingPalette: VariantPalette = {
    ...standardPalette,
    labelColor: colors.onBoardingDefault,
    borderColor: colors.onBoardingBorder,
    defaultColor: colors.onBoardingDefault,
    defaultColorBK: colors.onBoardingBK,
};

export const paletteVariants: Record<Variant, VariantConfig> = {
    onBoarding: {
        background: require("../../assets/images/backgrounds/greenBackground.png"),
        placeholder: require("../../assets/images/placeholders/logoPlaceholder.png"),
        palette: OnBoardingPalette,
    },

    home: {
        background: require("../../assets/images/backgrounds/greenBackground.png"),
        placeholder: require("../../assets/images/placeholders/logoPlaceholder.png"),
        palette: HomePalette,
    },

    teams: {
        background: require("../../assets/images/backgrounds/orangeBackground.png"),
        placeholder: require("../../assets/images/placeholders/logoPlaceholder.png"),
        palette: TeamsPalette,
    },

    tournaments: {
        background: require("../../assets/images/backgrounds/purpleBackground.png"),
        placeholder: require("../../assets/images/placeholders/tournamentPlaceholder.jpg"),
        palette: TournamentsPalette,
    },

    profile: {
        background: require("../../assets/images/backgrounds/redBackground.png"),
        placeholder: require("../../assets/images/placeholders/profilePlaceholder.png"),
        palette: ProfilePalette,
    },
};