package com.tournamentplatform.teamservice.repository;

import com.tournamentplatform.teamservice.entity.Team;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamsRepository extends JpaRepository<Team, Long> {

    @Query("""
                SELECT DISTINCT team
                FROM Team team
                LEFT JOIN team.playerIds playerId
                LEFT JOIN team.adminIds adminId
                WHERE team.creatorId = :profileId
                   OR playerId = :profileId
                   OR adminId = :profileId
            """)
    List<Team> findAllByPlayerIds(@Param("profileId") String profileId);

    boolean existsByInvitationCode(String invitationCode);

    Optional<Team> findByInvitationCode(String invitationCode);

}
