import {Sport} from "@/src/services/users/userConstants";
import {quadrato, rombo} from "@/src/components/pagesComponents/teams/field/consts/FootballFormations";
import {classicFive, doubleGuardThree, triangleThree, twoOneTwoFive} from "./BasketballFormations";
import {
    blockerDefenderTwo,
    oneTwoThree,
    sideBySideTwo,
    twoOneThree
} from "@/src/components/pagesComponents/teams/field/consts/BeachVolleyFormations";
import {FieldRole} from "@/src/components/pagesComponents/teams/field/FieldPaletteManager";

//  Formazioni disponibili per ogni sport
export const FORMATIONS_BY_SPORT: Partial<Record<Sport, Formation[]>> = {
    [Sport.FOOTBALL]: [rombo, quadrato],

    [Sport.BASKETBALL]: [
        classicFive,
        twoOneTwoFive,
        triangleThree,
        doubleGuardThree,
    ],

    [Sport.BEACH_VOLLEY]: [
        blockerDefenderTwo,
        oneTwoThree,
        sideBySideTwo,
        twoOneThree,
    ],
};

//  Componente della formazione
export type FormationSlot = {
    role: FieldRole;
    label: string;
    position: {
        x: number;
        y: number;
    };
};

//  Formazione
export type Formation = {
    name: string;
    label: string;
    slots: FormationSlot[];
};