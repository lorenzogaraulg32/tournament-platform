import {ImageSourcePropType} from "react-native";
import { colors, fonts } from "./theme";


export type StandardPalette = {
    labelFontSize: number
    labelFontWeight: string
}

export type VariantPalette = StandardPalette & {
    labelColor: string
    borderColor: string;
    defaultColor: string;
    defaultColorBK: string
};




/* Varianti e palettes associate per le pagine */

export type BKVariant = | "home" | "teams" | "tournaments" | "profile";

export type VariantConfig = {
    background: ImageSourcePropType;
    palette: VariantPalette;
};

export const standardPalette ={
    labelFontSize: fonts.label,
    labelFontWeight: fonts.labelWeight,
    labelColor: colors.label,
    labelSecondaryColor: colors.labelSecondary
}

export const HomePalette: VariantPalette = {
    ...standardPalette,
    borderColor: "",
    defaultColor: "",
    defaultColorBK: ""
}

export const TeamsPalette: VariantPalette = {
    ...standardPalette,
    borderColor: "",
    defaultColor: "",
    defaultColorBK: ""
}

export const ProfilePalette: VariantPalette = {
    ...standardPalette,
    borderColor: "",
    defaultColor: "",
    defaultColorBK: ""
}

export const TournamentsPalette: VariantPalette =  {
    ...standardPalette,
    borderColor: "",
    defaultColor: "",
    defaultColorBK: ""
}


export const variants: Record<BKVariant, VariantConfig> = {

    home: {
        background: require("../../assets/images/backgrounds/greenBackground.png"),
        palette: HomePalette
    },

    teams: {
        background: require("../../assets/images/backgrounds/orangeBackground.png"),
        palette: TeamsPalette
    },

    tournaments: {
        background: require("../../assets/images/backgrounds/purpleBackground.png"),
        palette: TournamentsPalette
    },

    profile: {
        background: require("../../assets/images/backgrounds/redBackground.png"),
        palette: ProfilePalette,
    },

};








