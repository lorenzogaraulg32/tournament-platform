import {Formation} from "@/src/components/pagesComponents/teams/field/consts/FieldConst";

/**
 * Beach volley 2v2.
 */
export const blockerDefenderTwo: Formation = {
    name: "BEACH_BLOCKER_DEFENDER_2",
    label: "Blocker + Difensore",
    slots: [
        {
            role: "blocker",
            label: "Blocker",
            position: {x: 50, y: 40},
        },
        {
            role: "beach_defender",
            label: "Difensore",
            position: {x: 50, y: 72},
        },
    ],
};

export const sideBySideTwo: Formation = {
    name: "BEACH_SIDE_BY_SIDE_2",
    label: "Affiancati",
    slots: [
        {
            role: "blocker",
            label: "Blocker",
            position: {x: 30, y: 55},
        },
        {
            role: "beach_defender",
            label: "Difensore",
            position: {x: 70, y: 55},
        },
    ],
};

/**
 * Schemi 3v3 custom per JoinCup.
 * Il 3v3 non è il formato standard del beach volley FIVB.
 */
export const oneTwoThree: Formation = {
    name: "BEACH_1_2_3",
    label: "Triangolo 1-2",
    slots: [
        {
            role: "blocker",
            label: "Blocker",
            position: {x: 50, y: 40},
        },
        {
            role: "beach_defender",
            label: "Difensore sinistro",
            position: {x: 27, y: 70},
        },
        {
            role: "fill_bv",
            label: "Difensore destro",
            position: {x: 73, y: 70},
        },
    ],
};

export const twoOneThree: Formation = {
    name: "BEACH_2_1_3",
    label: "Triangolo 2-1",
    slots: [
        {
            role: "blocker",
            label: "Blocker",
            position: {x: 30, y: 40},
        },
        {
            role: "fill_bv",
            label: "Supporto a rete",
            position: {x: 70, y: 40},
        },
        {
            role: "beach_defender",
            label: "Difensore",
            position: {x: 50, y: 72},
        },
    ],
};
