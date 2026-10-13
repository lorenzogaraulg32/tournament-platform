//stili delle card
import {StyleSheet} from "react-native";

export const cardPaletteStyles = StyleSheet.create({
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

export const compactCardPaletteStyles = StyleSheet.create({
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

export const fieldBackgroundStyles = StyleSheet.create({
    background: {
        ...StyleSheet.absoluteFill,
        overflow: "hidden",
    },

    glowLeft: {
        position: "absolute",
        left: -24,
        top: -30,
        width: 58,
        height: 58,
        borderRadius: 29,
    },

    glowRight: {
        position: "absolute",
        right: -30,
        bottom: -30,
        width: 64,
        height: 64,
        borderRadius: 32,
    },

    diagonalBand: {
        position: "absolute",
        right: -5,
        top: -20,
        width: 18,
        height: 90,
        transform: [{rotate: "25deg"}],
    },

    diagonalLine: {
        position: "absolute",
        right: 19,
        top: -20,
        width: 2,
        height: 90,
        transform: [{rotate: "25deg"}],
    },

    brush: {
        position: "absolute",
        right: -16,
        bottom: -20,
        width: 52,
        height: 30,
        borderRadius: 18,
        transform: [{rotate: "-15deg"}],
    },

    bottomAccent: {
        position: "absolute",
        bottom: 0,
        left: "30%",
        right: "30%",
        height: 2,
        borderRadius: 1,
    },
});
