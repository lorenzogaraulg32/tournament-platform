enum TournamentFormat {
    GROUPS = "GROUPS",
    KNOWCKOUT = "KNOWCKOUT",
    GROUPS_AND_KNOCKOUT = "GROUPS_AND_KNOCKOUT"
}

enum TournamentStatus {

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


export type CreateTournamentRequest = {
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    minTeams: number,
    maxTeams: number,
    format: TournamentFormat,
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
    rulesUrl: string,
    createdById: string,
    adminsId: string[]
}
