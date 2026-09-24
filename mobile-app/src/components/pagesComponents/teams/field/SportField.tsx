import {ComponentType, ReactNode} from "react";
import {Sport} from "@/src/services/users/userConstants";

import FootballField from "./fieldTypes/FootballField";
import BasketballField from "./fieldTypes/BasketballField";
import BeachVolleyField from "./fieldTypes/BeachVolleyField";

type FieldProps = {
    children?: ReactNode;
};

type SportFieldProps = {
    sport: Sport;
    children?: ReactNode;
};

const FIELD_BY_SPORT: Record<Sport, ComponentType<FieldProps>> = {
    [Sport.FOOTBALL]: FootballField,
    [Sport.BASKETBALL]: BasketballField,
    [Sport.BEACH_VOLLEY]: BeachVolleyField,
};

export default function SportField({
                                       sport,
                                       children,
                                   }: SportFieldProps) {

    const FieldComponent = FIELD_BY_SPORT[sport];

    return (
        <FieldComponent>
            {children}
        </FieldComponent>
    );
}