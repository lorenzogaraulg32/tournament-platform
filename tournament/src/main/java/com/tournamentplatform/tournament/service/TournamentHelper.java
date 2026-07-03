package com.tournamentplatform.tournament.service;

import com.tournamentplatform.tournament.dto.tournaments.TournamentGetResponse;
import com.tournamentplatform.tournament.dto.tournaments.TournamentPatchRequest;
import com.tournamentplatform.tournament.entity.Tournament;

import org.springframework.stereotype.Component;

@Component
public class TournamentHelper {


    //TournamentHelper

    public TournamentGetResponse toTournamentGetResponse(Tournament tournament) {
        return new TournamentGetResponse(
                tournament.getId(),
                tournament.getName(),
                tournament.getDescription(),
                tournament.getStartDate(),
                tournament.getEndDate(),
                tournament.getCreatedAt(),
                tournament.getUpdatedAt(),
                tournament.getMinTeams(),
                tournament.getMaxTeams(),
                tournament.getFormat().name(),
                tournament.getStatus().name()
        );
    }

    public void validateTournament(Tournament tournament) {

        if (tournament.getName() == null || tournament.getName().isBlank()) {
            throw new IllegalArgumentException("Il nome del torneo non può essere vuoto");
        }

        if (tournament.getMinTeams() != null && tournament.getMinTeams() < 2) {
            throw new IllegalArgumentException("Il numero minimo di squadre deve essere almeno 2");
        }

        if (tournament.getMaxTeams() != null && tournament.getMinTeams() != null
                && tournament.getMaxTeams() < tournament.getMinTeams()) {
            throw new IllegalArgumentException("Il numero massimo di squadre non può essere minore del minimo");
        }

        if (tournament.getStartDate() != null && tournament.getEndDate() != null
                && tournament.getStartDate().isAfter(tournament.getEndDate())) {
            throw new IllegalArgumentException("La data di inizio non può essere successiva alla data di fine");
        }
    }

    public void applyTournamentPatch(Tournament tournament, TournamentPatchRequest request) {

        if (request.getName() != null) {
            tournament.setName(request.getName());
        }

        if (request.getDescription() != null) {
            tournament.setDescription(request.getDescription());
        }

        if (request.getStartDate() != null) {
            tournament.setStartDate(request.getStartDate());
        }

        if (request.getEndDate() != null) {
            tournament.setEndDate(request.getEndDate());
        }

        if (request.getMinTeams() != null) {
            tournament.setMinTeams(request.getMinTeams());
        }

        if (request.getMaxTeams() != null) {
            tournament.setMaxTeams(request.getMaxTeams());
        }

        if (request.getFormat() != null) {
            tournament.setFormat(request.getFormat());
        }

        if (request.getStatus() != null) {
            tournament.setStatus(request.getStatus());
        }
    }

}
