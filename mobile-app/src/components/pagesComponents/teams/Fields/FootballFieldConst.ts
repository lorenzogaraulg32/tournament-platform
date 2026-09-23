import {FormationDefinition} from "@/src/components/pagesComponents/teams/Fields/FieldConst";

export const rombo: FormationDefinition = {
    id: "ROMBO",
    label: "Rombo",
    slots: [
        {
            id: "goalkeeper",
            label: "Portiere",
            position: {x: 50, y: 86},
        },
        {
            id: "central_defender",
            label: "Difensore centrale",
            position: {x: 50, y: 65},
        },
        {
            id: "left_midfielder",
            label: "Laterale sinistro",
            position: {x: 20, y: 45},
        },
        {
            id: "right_midfielder",
            label: "Laterale destro",
            position: {x: 80, y: 45},
        },
        {
            id: "central_forward",
            label: "Punta",
            position: {x: 50, y: 25},
        },
    ],
};

export const quadrato: FormationDefinition = {
    id: "SQUARE",
    label: "Quadrato",
    slots: [
        {
            id: "goalkeeper",
            label: "Portiere",
            position: {x: 50, y: 86},
        },
        {
            id: "left_defender",
            label: "Difensore sinistro",
            position: {x: 27, y: 62},
        },
        {
            id: "right_defender",
            label: "Difensore destro",
            position: {x: 73, y: 62},
        },
        {
            id: "left_forward",
            label: "Attaccante sinistro",
            position: {x: 27, y: 25},
        },
        {
            id: "right_forward",
            label: "Attaccante destro",
            position: {x: 73, y: 25},
        },
    ],
};