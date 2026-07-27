package com.tournamentplatform.teamservice.repository;

import com.tournamentplatform.teamservice.entity.Team;
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
            JOIN team.playerIds playerId
            WHERE playerId = :userId
            """)
    List<Team> findAllByPlayerIds(@Param("userId") String userId);



}
