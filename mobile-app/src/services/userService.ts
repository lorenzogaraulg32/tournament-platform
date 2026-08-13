export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
    NOT_SPECIFIED = "NOT_SPECIFIED"
}

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

export type GeoLocation = {
    label: string;
    latitude: number;
    longitude: number;
};

export type UserOnBoardingInfo = {
    username: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    gender: Gender | null;
    sports: Sport[];
    roles: UserSportRole[];
    location: GeoLocation | null;
};


export type UserInfo = {
    username: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    gender: Gender | null;
    sports: Sport[];
    roles: UserSportRole[];
    location: GeoLocation | null;
    profilePicUrl?: string,
};

/* TODO POST DEL CREATE USER
export async function createUser(
    userData: UserOnBoardingInfo
): Promise<LoginResponse> {
    // POST /users/me
}

*/
