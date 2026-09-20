package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.dto.teamCreation.TeamCreationRequest;
import com.tournamentplatform.teamservice.dto.teamGet.TeamResponse;
import com.tournamentplatform.teamservice.dto.teamModify.TeamUpdateRequest;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.TeamNameAlreadyExistsException;
import com.tournamentplatform.teamservice.mapper.TeamMapper;
import com.tournamentplatform.teamservice.repository.TeamsRepository;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.springframework.http.MediaType.APPLICATION_OCTET_STREAM;

@Service
public class TeamService {

    private final TeamsRepository teamsRepository;
    private final TeamAuthorizationHelper teamAuthorizationHelper;
    private final LogoStorageService logoStorageService;
    private final ServicesHelper servicesHelper;
    private final TeamMapper mapper;

    public TeamService(
            TeamsRepository teamsRepository,
            TeamAuthorizationHelper teamAuthorizationHelper,
            LogoStorageService logoStorageService,
            ServicesHelper servicesHelper,
            TeamMapper mapper) {
        this.teamsRepository = teamsRepository;
        this.teamAuthorizationHelper = teamAuthorizationHelper;
        this.logoStorageService = logoStorageService;
        this.servicesHelper = servicesHelper;
        this.mapper = mapper;
    }

    @Transactional
    public TeamResponse createTeam(TeamCreationRequest request, MultipartFile logo) {

        String currentUserId = teamAuthorizationHelper.getCurrentUserId();

        Set<String> players = new HashSet<>();
        players.add(currentUserId);

        Set<String> admins = new HashSet<>();
        admins.add(currentUserId);


        Team team = new Team(
                request.getName(),
                request.getDescription(),
                currentUserId,
                players,
                admins,
                request.getStatus(),
                mapper.toGeoLocation(request.getLocation()),
                servicesHelper.generateUniqueInvitationCode(),
                request.getSport()
        );

        Team savedTeam = teamsRepository.save(team);

        if (logo != null && !logo.isEmpty()) {
            String logoUrl = logoStorageService.storeTeamLogo(
                    team.getId(),
                    logo
            );

            savedTeam.setImageUrl(logoUrl);
        }

        return mapper.toTeamResponse(savedTeam);
    }

    @Transactional
    public TeamResponse updateTeam(String teamId, TeamUpdateRequest request, MultipartFile logo) {
        Team team = servicesHelper.getTeamEntityOrThrow(teamId);

        teamAuthorizationHelper.checkTeamAdmin(team);

        if (request.getName() != null) {
            String name = request.getName().trim();

            if (!name.equals(team.getName())) {
                checkTeamName(name);
                team.setName(name);
            }
        }

        if (request.getDescription() != null) {
            team.setDescription(request.getDescription().trim());
        }

        if (request.getStatus() != null) {
            team.setStatus(request.getStatus());
        }

        if (request.isLocationProvided()) {
            team.setLocation(mapper.toGeoLocation(request.getLocation()));
        }

        if (logo != null && !logo.isEmpty()) {
            String logoUrl = logoStorageService.storeTeamLogo(
                    team.getId(),
                    logo
            );

            team.setImageUrl(logoUrl);
        } else if ("REMOVE".equals(request.getNewImageUrl())) {
            logoStorageService.deleteTeamLogo(team.getId());
            team.setImageUrl(null);
        }

        Team savedTeam = teamsRepository.save(team);
        return mapper.toTeamResponse(savedTeam);
    }

    public String checkTeamName(String teamName) {
        if (teamsRepository.existsByName(teamName)) {
            throw new TeamNameAlreadyExistsException();
        }

        return "valid";
    }

    public TeamResponse getTeam(String id) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);

        return mapper.toTeamResponse(team);
    }

    public ResponseEntity<Resource> getTeamLogo(String teamId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);

        teamAuthorizationHelper.checkTeamPlayer(team);

        Resource logo =
                logoStorageService.loadTeamLogo(
                        team.getImageUrl()
                );

        MediaType contentType = MediaTypeFactory
                .getMediaType(logo)
                .orElse(APPLICATION_OCTET_STREAM);

        return ResponseEntity
                .ok()
                .contentType(contentType)
                .cacheControl(CacheControl.noStore())
                .body(logo);
    }

    public TeamResponse patchTeamCode(String id) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);

        teamAuthorizationHelper.checkTeamAdmin(team);

        team.setInvitationCode(servicesHelper.generateUniqueInvitationCode());

        Team savedTeam = teamsRepository.save(team);

        return mapper.toTeamResponse(savedTeam);
    }

    public TeamResponse patchTeamLogo(String id, MultipartFile file) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);

        teamAuthorizationHelper.checkTeamAdmin(team);

        String logoUrl = logoStorageService.storeTeamLogo(team.getId(), file);

        team.setImageUrl(logoUrl);

        Team savedTeam = teamsRepository.save(team);

        return mapper.toTeamResponse(savedTeam);
    }

    @Transactional
    public void deleteTeam(String id) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);

        teamAuthorizationHelper.checkTeamCreator(team);

        Long teamId = team.getId();

        teamsRepository.delete(team);

        teamsRepository.flush();

        logoStorageService.deleteTeamLogo(teamId);
    }

    public List<TeamResponse> getUserTeams(String playerId) {

        return teamsRepository
                .findAllByPlayerIds(playerId)
                .stream()
                .map(mapper::toTeamResponse)
                .toList();
    }


}
