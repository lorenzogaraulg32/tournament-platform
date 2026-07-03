package com.tournamentplatform.tournament.repository;

import com.tournamentplatform.tournament.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {

    //metodi di query al db oltre a quelli di default



}
