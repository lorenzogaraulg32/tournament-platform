package com.tournamentplatform.authservice.repository;

import com.tournamentplatform.authservice.entity.RevokedSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RevokedSubjectRepository extends JpaRepository<RevokedSubject, String> {
}
