package com.tournamentplatform.teamservice.repository;

import com.tournamentplatform.teamservice.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamsRepository extends JpaRepository<Team,Long> {
}
