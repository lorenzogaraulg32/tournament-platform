import {Gender, Sport, UserSportRole} from "@/src/services/users/userConstants";
import {authenticatedFetch} from "@/src/services/fetchService";
import {GeoLocation} from "@/src/services/common";

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


export type UserModInfo = {
    username: string;
    firstName: string;
    lastName: string;
    sports: Sport[];
    roles: UserSportRole[];
    location: GeoLocation | null;
    newPicUrl: string | undefined;
};

//Rappresenta la info dell'utente senza i dettagli di autenticazione
export type UserInfo = {
    id: string
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


export async function modUser(userData: UserModInfo){

}



