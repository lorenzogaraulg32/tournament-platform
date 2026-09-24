import {Sport} from "@/src/services/users/userConstants";
import {quadrato, rombo} from "@/src/components/pagesComponents/teams/Fields/FootballFieldConst";

//  Formazioni disponibili per ogni sport
export const FORMATIONS_BY_SPORT: Partial<Record<Sport, Formation[]>> = {
    [Sport.FOOTBALL]: [rombo, quadrato],
};

//  Componente della formazione
export type FormationSlot = {
    role: string;
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