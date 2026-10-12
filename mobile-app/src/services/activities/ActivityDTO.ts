export type ActivityRequest = {
    issuedAt?: string,
    actor: EntityReference,
    subject: EntityReference,
    context?: EntityReference,
    action: Action,
    details?: string
}

export type ActivityResponse = {
    id: string;
    issuedAt: string;
    label: string;
};

export type EntityReference = {
    id: string,
    entityName: string,
    type: EntityType,

}


export enum EntityType {
    USER = "USER",
    TEAM = "TEAM",
    TOURNAMENT = "TOURNAMENT"
}

export enum Action {

    // actor = USER
    JOINED_TEAM = "JOINED_TEAM",
    LEFT_TEAM = "LEFT_TEAM",
    REMOVED_FROM_TEAM = "REMOVED_FROM_TEAM",
    MODIFIED_TEAM = "MODIFIED_TEAM",
    DELETED_TEAM = "DELETED_TEAM",
    CREATED_TEAM = "CREATED_TEAM",
    MODIFIED_LINEUP = "MODIFIED_LINEUP",
    REFRESHED_INVITATION_TEAM = "REFRESHED_INVITATION_TEAM",
    REFRESHED_INVITATION_TOURNAMENT = "REFRESHED_INVITATION_TOURNAMENT",
    REMOVED_TOURNAMENT_TEAM = "REMOVED_TOURNAMENT_TEAM",
    CREATED_TOURNAMENT = "CREATED_TOURNAMENT",
    MODIFIED_TOURNAMENT = "MODIFIED_TOURNAMENT",
    DELETE_TOURNAMENT = "DELETE_TOURNAMENT",
    UPDATED_TOURNAMENT_STATE = "UPDATED_TOURNAMENT_STATE",
    PROMOTED_ADMIN = "PROMOTED_ADMIN",
    DEMOTED_ADMIN = "DEMOTED_ADMIN",
    MODIFIED_PROFILE = "MODIFIED_PROFILE",


    // actor = TEAM
    TOURNAMENT_PLACEMENT = "TOURNAMENT_PLACEMENT",
    JOINED_TOURNAMENT = "JOINED_TOURNAMENT",
    LEFT_TOURNAMENT = "LEFT_TOURNAMENT",
}


