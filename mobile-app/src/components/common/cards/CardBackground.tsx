import {cardPaletteStyles, compactCardPaletteStyles} from "@/src/constants/palette/PaletteStyles";
import {View} from "react-native";
import {CardBackgroundPalette} from "@/src/constants/palette/CardPalettesManager";


/**
 * Componente puramente grafico, il cui scopo è rappresentare il background di una card in base alla palette
 * @param palette palette di colori della card
 * @param compact distingue fra card grande oppure card piccola
 * @constructor
 */
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
