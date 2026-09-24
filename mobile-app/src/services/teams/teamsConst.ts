import {GeoLocation} from "@/src/services/common";
import {Sport} from "@/src/services/users/userConstants";

export type RecruitmentStatus = "OPEN" | "CLOSED";

export type TeamDetails = {
    id: string;
    name: string;
    description: string;
    status: RecruitmentStatus;
    location: GeoLocation | null;
    imageUrl?: string | null;
    creatorId: string;
    playerIds: string[];
    adminIds: string[];
    invitationCode: string;
    sport: Sport;
    formation: TeamFormation
};


export type TeamCreationRequest = {
    name: string;
    description?: string;
    status: RecruitmentStatus;
    location: GeoLocation | null;
    sport?: Sport
};


export type TeamUpdateRequest = {
    name?: string;
    description?: string;
    status?: RecruitmentStatus;
    location: GeoLocation | null;
    sport: Sport,
    imageUrl?: string;
};

export type TeamErrorFields = {
    name?: string;
    description?: string;
    status?: string;
    location?: string;
    logo?: string;
    sport?: string;
}


export type TeamFormation = {
    name: string | null,
    slotAssignment: Record<string, string>,
    benchOrder: string[]
}