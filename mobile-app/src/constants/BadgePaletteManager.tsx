import {Sport} from "@/src/services/sportDTO";

export const badgeColors = {

    redText: "#FFEBEE",
    redBK: "rgba(183, 28, 28, 0.35)",
    redBorder: "#D32F2F",

    orangeText: "#FFF3E0",
    orangeBK: "rgba(230, 81, 0, 0.35)",
    orangeBorder: "#F57C00",

    yellowText: "#FFFDE7",
    yellowBK: "rgba(249, 168, 37, 0.35)",
    yellowBorder: "#FBC02D",

}


export type BadgePalette = {
    backgroundColor: string,
    textColor: string,
    borderColor: string
}


export const FootballBadgeVariant: BadgePalette = {
    backgroundColor: badgeColors.redBK,
    textColor: badgeColors.redText,
    borderColor: badgeColors.redBorder,
}


export const BeachBadgeVariant: BadgePalette = {
    backgroundColor: badgeColors.yellowBK,
    textColor: badgeColors.yellowText,
    borderColor: badgeColors.yellowBorder,
}

export const BasketBadgeVariant: BadgePalette = {
    backgroundColor: badgeColors.orangeBK,
    textColor: badgeColors.orangeText,
    borderColor: badgeColors.orangeBorder,
}


export const rolePaletteMapper: Record<Sport, BadgePalette> = {
    [Sport.FOOTBALL]: FootballBadgeVariant,
    [Sport.BASKETBALL]: BasketBadgeVariant,
    [Sport.BEACH_VOLLEY]: BeachBadgeVariant
}