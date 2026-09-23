import {Sport} from "@/src/services/users/userConstants";
import {quadrato, rombo} from "@/src/components/pagesComponents/teams/Fields/FootballFieldConst";

export const FORMATIONS_BY_SPORT: Partial<Record<Sport, FormationDefinition[]>> = {
    [Sport.FOOTBALL]: [rombo, quadrato],
};

export type FormationSlot = {
    id: string;
    label: string;
    position: {
        x: number;
        y: number;
    };
};

export type FormationDefinition = {
    id: string;
    label: string;
    slots: FormationSlot[];
};