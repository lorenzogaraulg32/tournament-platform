import {SportRole} from "@/src/services/sportDTO";
import {View} from "react-native";
import {
    blueRoleCardColors,
    CardBackgroundPalette,
    CompactCardPalette,
    greenRoleCardColors,
    redRoleCardColors,
    tealRoleCardColors,
    yellowRoleCardColors
} from "@/src/constants/palette/CardPalettesManager";
import {fieldBackgroundStyles} from "@/src/constants/palette/PaletteStyles";

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

export function FieldCardBackground({
                                        palette,
                                    }: {
    palette: CardBackgroundPalette;
}) {
    return (
        <View
            pointerEvents="none"
            style={[
                fieldBackgroundStyles.background,
                {backgroundColor: palette.background},
            ]}
        >
            <View
                style={[
                    fieldBackgroundStyles.glowLeft,
                    {backgroundColor: palette.glowLeft},
                ]}
            />

            <View
                style={[
                    fieldBackgroundStyles.glowRight,
                    {backgroundColor: palette.glowRight},
                ]}
            />

            <View
                style={[
                    fieldBackgroundStyles.diagonalBand,
                    {backgroundColor: palette.diagonalAccent},
                ]}
            />

            <View
                style={[
                    fieldBackgroundStyles.diagonalLine,
                    {backgroundColor: palette.diagonalSecondary},
                ]}
            />

            <View
                style={[
                    fieldBackgroundStyles.brush,
                    {backgroundColor: palette.brush},
                ]}
            />

            <View
                style={[
                    fieldBackgroundStyles.bottomAccent,
                    {backgroundColor: palette.accent},
                ]}
            />
        </View>
    );
}