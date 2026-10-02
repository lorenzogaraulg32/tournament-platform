import {GeoLocation, LocalDateString, RecruitmentStatus} from "@/src/services/common";
import {Sport} from "@/src/services/users/userDTO";
import {Media} from "@/src/services/mediaService";


export enum TournamentFormat {
    GROUPS = "GROUPS",
    KNOWCKOUT = "KNOWCKOUT",
    GROUPS_AND_KNOCKOUT = "GROUPS_AND_KNOCKOUT"
}

export const TournamentFormatLabels = {
    GROUPS: {
        label: "Gironi",
        desc: "Il torneo srà organizzato unicamente in gironi"
    },
    KNOWCKOUT: {
        label: "Eliminazione diretta",
        desc: "Il torneo srà organizzato unicamente in scontri ad eliminazione diretta"
    },
    GROUPS_AND_KNOCKOUT: {
        label: "Gironi e eliminazione diretta",
        desc: "Il torneo srà organizzato con una fase a gironi ed una fase ad eliminazione diretta"
    }
}

export enum TournamentStatus {
    CREATED = "CREATED",
    REG_OPEN = "REG_OPEN",
    REP_CLOSED = "REP_CLOSED",
    DRAFTING_MATCHES = "DRAFTING_MATCHES",
    IN_PROGRESS = "IN_PROGRESS",
    ENDED = "ENDED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}


export type UserTournamentsResponse = {
    managed: TournamentDetails[],
    participating: TournamentDetails[]
}


//regolamento e logo arrivano nel multipart
export type TournamentCreationRequest = {
    name: string;
    description?: string;
    location: GeoLocation | null;
    sport: Sport | null;
    format: TournamentFormat | null,
    recruitmentStatus: RecruitmentStatus;
    startingDate: LocalDateString | null
    endingDate: LocalDateString | null
    maxTeams: number
    minTeams: number
    logo: Media | null,
    rules: Media | null,
}


export type TournamentDetails = {
    id: string
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    createdAt: string,
    updatedAt: string,
    minTeams: number,
    maxTeams: number,
    format: TournamentFormat,
    status: TournamentStatus,
    createdById: string,
    adminsId: string[]
    registeredTeamIds?: string[],
    recruitmentStatus: RecruitmentStatus;
    location?: GeoLocation
    invitationCode: string;
    logo: Media | null,
    rules: Media | null,
}

export type TournamentErrorFields = {
    name?: string;
    description?: string;
    rules?: string;
    location?: string;
    logo?: string;
    sport?: string;
    format?: string,
    startingDate?: string
    endingDate?: string
    maxTeams?: string
    minTeams?: string
    recruitmentStatus?: string
}
