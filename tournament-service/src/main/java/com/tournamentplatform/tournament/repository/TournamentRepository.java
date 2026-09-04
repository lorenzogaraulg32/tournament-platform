package com.tournamentplatform.tournament.repository;

import com.tournamentplatform.tournament.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {

    //metodi di query al db oltre a quelli di default
    boolean existsByInvitationCode(String invitationCode);

    @Query("""
        SELECT DISTINCT tournament
        FROM Tournament tournament
        LEFT JOIN tournament.adminsById adminId
        WHERE tournament.createdByUserId = :userId
           OR adminId = :userId
    """)
    List<Tournament> findManagedByUserId(
            @Param("userId") String userId
    );

    @Query("""
        SELECT DISTINCT tournament
        FROM Tournament tournament
        JOIN tournament.registeredTeamIds teamId
        WHERE teamId IN :teamIds
    """)
    List<Tournament> findParticipatedByTeamIds(@Param("teamIds") Set<Long> teamIds);

}
