package com.tournamentplatform.tournament.service;

import com.tournamentplatform.tournament.client.MediaServiceClient;
import com.tournamentplatform.tournament.dto.tournaments.TournamentPatchRequest;
import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.entity.TournamentStatus;
import com.tournamentplatform.tournament.errorHandling.tournamentExceptions.InvalidTournamentException;
import com.tournamentplatform.tournament.errorHandling.tournamentExceptions.TournamentNotFoundException;
import com.tournamentplatform.tournament.repository.TournamentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Component
@AllArgsConstructor
public class TournamentHelper {

    private final TournamentRepository tournamentRepository;
    private final MediaServiceClient mediaServiceClient;


    public Tournament findOrThrow(String id) {
        return tournamentRepository.findById(Long.valueOf(id)).orElseThrow(TournamentNotFoundException::new);
    }

    public Tournament saveTournament(Tournament tournament) {
        return tournamentRepository.save(tournament);
    }


    public String generateUniqueInvitationCode() {
        String code;

        do {
            code = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 8)
                    .toUpperCase();
        } while (tournamentRepository.existsByInvitationCode(code));

        return code;
    }

    public void validateTournament(Tournament tournament) {
        if (tournament.getMaxTeams() < tournament.getMinTeams()) {
            throw new InvalidTournamentException();
        }

        if (tournament.getStartDate().isAfter(tournament.getEndDate())) {
            throw new InvalidTournamentException();
        }
    }

    public void applyTournamentPatch(Tournament tournament, TournamentPatchRequest request, MultipartFile logo, MultipartFile rules) {

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

        if (logo != null && !logo.isEmpty()) {

            mediaServiceClient.putTournamentFile(String.valueOf(tournament.getId()), logo, "/internal/media/tournament/{id}/logo");

        } else if (Boolean.TRUE.equals(request.isRemoveLogo())) {

            mediaServiceClient.putTournamentFile(String.valueOf(tournament.getId()), rules, "/internal/media/tournament/{id}/rules");
        }

    }

    public boolean canBeDeleted(Tournament tournament) {
        return tournament.getStatus().equals(TournamentStatus.CREATED) || tournament.getStatus().equals(TournamentStatus.REG_OPEN);
    }
}
