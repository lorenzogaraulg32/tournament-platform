import {Gender, GeoLocation, Sport, UserSportRole} from "@/src/services/users/userConstants";
import {authenticatedFetch} from "@/src/services/fetchService";

//Usato solo per la creazione utente non contiene logoUrl
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

//Rappresenta la info dell'utente senza i dettagli di autenticazione
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


export type UserEntity = {
    id: string
    userInfo: UserInfo
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function completeOnBoarding(
    userData: UserOnBoardingInfo
): Promise<UserInfo> {

    const response = await authenticatedFetch(
        `${API_URL}/users/me`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        }
    );

    return await response.json() as UserInfo;
}


export async function loadUserInfo(
    id: string
): Promise<UserInfo> {

    const response = await authenticatedFetch(
        `${API_URL}/users/${id}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as UserInfo;
}



