import {GeoLocation, RecruitmentStatus} from "@/src/services/common";
import {Sport} from "@/src/services/users/userDTO";
import {Media} from "@/src/services/mediaService";


export type TeamDetails = {
    id: string;
    name: string;
    description: string;
    status: RecruitmentStatus;
    location: GeoLocation | null;
    creatorId: string;
    playerIds: string[];
    adminIds: string[];
    invitationCode: string;
    sport: Sport;
    formation: TeamFormation
    logo: Media | null
};


export type TeamCreationRequest = {
    name: string;
    description?: string;
    status: RecruitmentStatus;
    location: GeoLocation | null;
    sport?: Sport
    logo: Media | null
};


export type TeamUpdateRequest = {
    name?: string;
    description?: string;
    status?: RecruitmentStatus;
    location: GeoLocation | null;
    sport: Sport,
    logo?: Media | null
    removeLogo?: boolean;
};

export type TeamFormErrors = {
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