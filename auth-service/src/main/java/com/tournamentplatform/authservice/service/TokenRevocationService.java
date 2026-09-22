package com.tournamentplatform.authservice.service;

import com.tournamentplatform.authservice.entity.RevokedSubject;
import com.tournamentplatform.authservice.repository.RevokedSubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class TokenRevocationService {

    private final RevokedSubjectRepository revokedSubjectRepository;

    @Transactional
    public void revoke(String subject) {

        if (revokedSubjectRepository.existsById(subject)) {
            return;
        }

        revokedSubjectRepository.save(
                new RevokedSubject(
                        subject,
                        Instant.now()
                )
        );
    }

    @Transactional(readOnly = true)
    public boolean isRevoked(String subject) {
        return revokedSubjectRepository.existsById(subject);
    }

    @Transactional
    public void restore(String subject) {

        if (!revokedSubjectRepository.existsById(subject)) {
            return;
        }

        revokedSubjectRepository.deleteById(subject);
    }
}