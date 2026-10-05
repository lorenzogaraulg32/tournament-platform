import type {ImageSourcePropType, TextStyle} from "react-native";
import {colors, fonts} from "./theme";

export type Variant = "standard" | "home" | "teams" | "tournaments" | "profile" | "onBoarding";

export type StandardPalette = {
    labelFontSize: number;
    labelFontWeight: TextStyle["fontWeight"];
    labelColor: string;
    labelSecondaryColor: string;
    btnText: string,
};

export type VariantPalette = StandardPalette & {
    borderColor: string;
    defaultColor: string;
    defaultColorBK: string;
    btnBK: string,
};

export type VariantConfig = {
    background: ImageSourcePropType;
    placeholder?: ImageSourcePropType;
    palette: VariantPalette;
};

// Stili condivisi da tutte le varianti.
export const basicPalette: StandardPalette = {
    labelFontSize: fonts.label,
    labelFontWeight: fonts.labelWeight,
    labelColor: colors.label,
    labelSecondaryColor: colors.labelSecondary,
    btnText: "#ffffff"
};

export const standardPalette: VariantPalette = {
    ...basicPalette,
    borderColor: colors.greenBorder,
    defaultColor: colors.greenDefault,
    defaultColorBK: colors.greenBK,
    btnBK: "#ffffff",
    btnText: colors.greenDefault
};

export const HomePalette: VariantPalette = {
    ...basicPalette,
    borderColor: colors.greenBorder,
    defaultColor: colors.greenDefault,
    defaultColorBK: colors.greenBK,
    btnBK: colors.greenDefault,

};

export const TeamsPalette: VariantPalette = {
    ...basicPalette,
    borderColor: colors.orangeBorder,
    defaultColor: colors.orangeDefault,
    defaultColorBK: colors.orangeDefaultBK,
    btnBK: colors.orangeDefault,

};

export const TournamentsPalette: VariantPalette = {
    ...basicPalette,
    borderColor: colors.purpleBorder,
    defaultColor: colors.purpleDefault,
    defaultColorBK: colors.purpleBK,
    btnBK: colors.purpleDefault,

};

export const ProfilePalette: VariantPalette = {
    ...basicPalette,
    borderColor: colors.redBorder,
    defaultColor: colors.redDefault,
    defaultColorBK: colors.redDefaultBK,
    btnBK: colors.redDefault,

};

export const OnBoardingPalette: VariantPalette = {
    ...basicPalette,
    labelColor: colors.onBoardingDefault,
    borderColor: colors.onBoardingBorder,
    defaultColor: colors.onBoardingDefault,
    defaultColorBK: colors.onBoardingBK,
    btnBK: colors.orangeDefault,
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

    standard:{
        background: require("../../assets/images/backgrounds/greenBackground.png"),
        placeholder: require("../../assets/images/placeholders/logoPlaceholder.png"),
        palette: standardPalette,
    }
};