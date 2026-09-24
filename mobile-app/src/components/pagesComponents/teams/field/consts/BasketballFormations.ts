import {Formation} from "@/src/components/pagesComponents/teams/field/consts/FieldConst";

/**
 * Schemi a 5 giocatori.
 * I nomi descrivono la disposizione grafica/tattica nell'app,
 * non denominazioni ufficiali FIBA.
 */
export const classicFive: Formation = {
    name: "BASKET_CLASSIC_5",
    label: "Classico 1-2-2",
    slots: [
        {
            role: "point_guard",
            label: "Playmaker",
            position: {x: 50, y: 78},
        },
        {
            role: "shooting_guard",
            label: "Guardia",
            position: {x: 24, y: 56},
        },
        {
            role: "small_forward",
            label: "Ala piccola",
            position: {x: 76, y: 56},
        },
        {
            role: "power_forward",
            label: "Ala grande",
            position: {x: 32, y: 30},
        },
        {
            role: "center",
            label: "Centro",
            position: {x: 68, y: 24},
        },
    ],
};

export const twoOneTwoFive: Formation = {
    name: "BASKET_2_1_2_5",
    label: "2-1-2",
    slots: [
        {
            role: "point_guard",
            label: "Playmaker",
            position: {x: 32, y: 74},
        },
        {
            role: "shooting_guard",
            label: "Guardia",
            position: {x: 68, y: 74},
        },
        {
            role: "small_forward",
            label: "Ala piccola",
            position: {x: 50, y: 50},
        },
        {
            role: "power_forward",
            label: "Ala grande",
            position: {x: 28, y: 27},
        },
        {
            role: "center",
            label: "Centro",
            position: {x: 72, y: 27},
        },
    ],
};

/**
 * Schemi a 3 giocatori, pensati per il 3x3.
 */
export const triangleThree: Formation = {
    name: "BASKET_TRIANGLE_3",
    label: "Triangolo 1-2",
    slots: [
        {
            role: "point_guard",
            label: "Playmaker",
            position: {x: 50, y: 72},
        },
        {
            role: "small_forward",
            label: "Ala",
            position: {x: 27, y: 42},
        },
        {
            role: "center",
            label: "Centro",
            position: {x: 73, y: 30},
        },
    ],
};

export const doubleGuardThree: Formation = {
    name: "BASKET_DOUBLE_GUARD_3",
    label: "Doppia guardia 2-1",
    slots: [
        {
            role: "point_guard",
            label: "Playmaker",
            position: {x: 30, y: 65},
        },
        {
            role: "shooting_guard",
            label: "Guardia",
            position: {x: 70, y: 65},
        },
        {
            role: "center",
            label: "Centro",
            position: {x: 50, y: 28},
        },
    ],
};
