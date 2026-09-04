package com.tournamentplatform.tournament.dto.tournaments;

import java.util.List;

public record UserTournamentsResponse(
        List<TournamentGetResponse> managed,
        List<TournamentGetResponse> participating
) {}
