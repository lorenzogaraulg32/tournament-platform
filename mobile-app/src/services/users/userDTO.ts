import {GeoLocation, LocalDateString} from "@/src/services/common";
import {Media} from "@/src/services/mediaService";
import type {UserSportRole,} from "@/src/services/sportDTO";
import {
    fallbackRoleBySport,
    getRoleBySport,
    ROLE_LABELS,
    Sport,
    SPORT_LABELS,
    SPORT_ROLES,
    SportRole,
} from "@/src/services/sportDTO";

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
    avatar: Media | null
    deletingStatus: DeletingStatus
};

export type UserCreationRequest = {
    username: string;
    firstName: string;
    lastName: string;
    birthDate: LocalDateString | null
    gender: Gender | null;
    sports: Sport[];
    roles: UserSportRole[];
    location: GeoLocation | null;
    avatar: Media | null
};

export type UserModRequest = {
    username: string;
    firstName: string;
    lastName: string;
    sports: Sport[];
    roles: UserSportRole[];
    location: GeoLocation | null;
    avatar?: Media | null
};

export type ProfileFormErrors = {
    username?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    gender?: string;
    sports?: string;
    roles?: string
    location?: string;
    avatar?: string;
};


export enum DeletingStatus {
    ACTIVE = "ACTIVE",
    DELETING = "DELETING"
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
    NOT_SPECIFIED = "NOT_SPECIFIED"
}


export {
    Sport,
    SportRole,
    SPORT_LABELS,
    SPORT_ROLES,
    ROLE_LABELS,
    getRoleBySport,
    fallbackRoleBySport,
} from "@/src/services/sportDTO";

export type {
    UserSportRole
} from "@/src/services/sportDTO";




