import {
    blueRoleCardColors,
    CompactCardPalette,
    greenRoleCardColors,
    redRoleCardColors,
    tealRoleCardColors,
    yellowRoleCardColors
} from "@/src/constants/CardPalettesManager";

export type FieldRole =
// Calcio
    | "goalkeeper"
    | "central_defender"
    | "left_defender"
    | "right_defender"
    | "left_midfielder"
    | "right_midfielder"
    | "central_forward"
    | "left_forward"
    | "right_forward"

    // Beach Volley
    | "blocker"
    | "beach_defender"
    | "fill_bv"

    // Basket
    | "point_guard"
    | "shooting_guard"
    | "small_forward"
    | "power_forward"
    | "center";


export const fieldRoleCardPalettes: Record<FieldRole, CompactCardPalette> = {
    // Calcio
    goalkeeper: yellowRoleCardColors,

    central_defender: greenRoleCardColors,
    left_defender: greenRoleCardColors,
    right_defender: greenRoleCardColors,

    left_midfielder: blueRoleCardColors,
    right_midfielder: blueRoleCardColors,

    central_forward: redRoleCardColors,
    left_forward: redRoleCardColors,
    right_forward: redRoleCardColors,

    // Beach Volley
    blocker: yellowRoleCardColors,
    beach_defender: greenRoleCardColors,
    fill_bv: tealRoleCardColors,

    // Basket
    point_guard: blueRoleCardColors,
    shooting_guard: redRoleCardColors,
    small_forward: tealRoleCardColors,
    power_forward: greenRoleCardColors,
    center: yellowRoleCardColors,
};