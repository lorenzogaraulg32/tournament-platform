import {Formation} from "@/src/components/pagesComponents/teams/field/consts/FieldConst";

export const rombo: Formation = {
    name: "ROMBO",
    label: "Rombo",
    slots: [
        {
            role: "goalkeeper",
            label: "Portiere",
            position: {x: 50, y: 86},
        },
        {
            role: "central_defender",
            label: "Difensore centrale",
            position: {x: 50, y: 65},
        },
        {
            role: "left_midfielder",
            label: "Laterale sinistro",
            position: {x: 20, y: 45},
        },
        {
            role: "right_midfielder",
            label: "Laterale destro",
            position: {x: 80, y: 45},
        },
        {
            role: "central_forward",
            label: "Punta",
            position: {x: 50, y: 25},
        },
    ],
};

export const quadrato: Formation = {
    name: "SQUARE",
    label: "Quadrato",
    slots: [
        {
            role: "goalkeeper",
            label: "Portiere",
            position: {x: 50, y: 86},
        },
        {
            role: "left_defender",
            label: "Difensore sinistro",
            position: {x: 27, y: 62},
        },
        {
            role: "right_defender",
            label: "Difensore destro",
            position: {x: 73, y: 62},
        },
        {
            role: "left_forward",
            label: "Attaccante sinistro",
            position: {x: 27, y: 25},
        },
        {
            role: "right_forward",
            label: "Attaccante destro",
            position: {x: 73, y: 25},
        },
    ],
};