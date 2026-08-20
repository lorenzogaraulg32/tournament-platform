export enum Sport {
    FOOTBALL = "FOOTBALL",
    BEACH_VOLLEY = "BEACH_VOLLEY",
    BASKETBALL = "BASKETBALL"
}

export enum SportRole {
    GOALKEEPER = "GOALKEEPER",
    DEFENDER = "DEFENDER",
    MIDFIELDER = "MIDFIELDER",
    FORWARD = "FORWARD",
    FILL_FB = "FILL_FB",

    BLOCKER = "BLOCKER",
    BEACH_DEFENDER = "BEACH_DEFENDER",
    FILL_BV = "FILL_BV",

    POINT_GUARD = "POINT_GUARD",
    SHOOTING_GUARD = "SHOOTING_GUARD",
    SMALL_FORWARD = "SMALL_FORWARD",
    POWER_FORWARD = "POWER_FORWARD",
    CENTER = "CENTER",
    FILL_BK = "FILL_BK",
}


export type UserSportRole = {
    sport: Sport;
    role: SportRole;
};


export const SPORT_LABELS: Record<Sport, string> = {
    [Sport.FOOTBALL]: "Calcio",
    [Sport.BEACH_VOLLEY]: "Beach Volley",
    [Sport.BASKETBALL]: "Basket",
};

export const SPORT_ROLES: Record<Sport, SportRole[]> = {
    [Sport.FOOTBALL]: [
        SportRole.GOALKEEPER,
        SportRole.DEFENDER,
        SportRole.MIDFIELDER,
        SportRole.FORWARD,
        SportRole.FILL_FB,
    ],

    [Sport.BEACH_VOLLEY]: [
        SportRole.BLOCKER,
        SportRole.BEACH_DEFENDER,
        SportRole.FILL_BV,
    ],

    [Sport.BASKETBALL]: [
        SportRole.POINT_GUARD,
        SportRole.SHOOTING_GUARD,
        SportRole.SMALL_FORWARD,
        SportRole.POWER_FORWARD,
        SportRole.CENTER,
        SportRole.FILL_BK,
    ],
};

export const ROLE_LABELS: Record<SportRole, string> = {
    [SportRole.GOALKEEPER]: "Portiere",
    [SportRole.DEFENDER]: "Difensore",
    [SportRole.MIDFIELDER]: "Centrocampista",
    [SportRole.FORWARD]: "Attaccante",
    [SportRole.FILL_FB]: "Jolly",

    [SportRole.BLOCKER]: "Blocker",
    [SportRole.BEACH_DEFENDER]: "Difensore",
    [SportRole.FILL_BV]: "Jolly",

    [SportRole.POINT_GUARD]: "Playmaker",
    [SportRole.SHOOTING_GUARD]: "Guardia",
    [SportRole.SMALL_FORWARD]: "Ala piccola",
    [SportRole.POWER_FORWARD]: "Ala grande",
    [SportRole.CENTER]: "Centro",
    [SportRole.FILL_BK]: "Jolly",
};


export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
    NOT_SPECIFIED = "NOT_SPECIFIED"
}


export type GeoLocation = {
    label: string;
    latitude: number;
    longitude: number;
};