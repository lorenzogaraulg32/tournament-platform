package com.tournamentplatform.authservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "revoked_subjects")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RevokedSubject {

    @Id
    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "revoked_at", nullable = false)
    private Instant revokedAt;
}