import {ImageSourcePropType} from "react-native";


/* Varianti per gli sfondi pagina e tabs */

export type BKVariant = | "home" | "teams" | "tournaments" | "profile";

export type VariantConfig = {
    background: ImageSourcePropType;
};

export const variants: Record<BKVariant, VariantConfig> = {

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




