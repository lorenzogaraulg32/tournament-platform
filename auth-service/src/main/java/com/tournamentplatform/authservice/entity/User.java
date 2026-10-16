package com.tournamentplatform.authservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_external_identity",
                        columnNames = {"external_provider", "external_subject"}
                )
        })
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true)
    private String passwordHash;


    @Column(nullable = false)
    private boolean enabled;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private GlobalRole globalRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "external_provider")
    private ExternalProvider externalProvider;

    //identificativo univoco che il provider esterno assegna all'utente
    @Column(name = "external_subject")
    private String externalSubject;


    public User(String email, String passwordHash, boolean enabled, GlobalRole globalRole) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.enabled = enabled;
        this.globalRole = globalRole;
    }


    public boolean hasLocalAuthentication() {
        return passwordHash != null &&
                !passwordHash.isBlank();
    }

    public boolean hasExternalAuthentication() {
        return externalProvider != null &&
                externalSubject != null;
    }

    @PrePersist
    @PreUpdate
    private void validateAuthentication() {

        boolean providerPresent = externalProvider != null;
        boolean subjectPresent = externalSubject != null;

        if (providerPresent != subjectPresent) {
            throw new IllegalStateException(
                    "Provider e identificativo esterno devono essere entrambi presenti o assenti"
            );
        }

        if (!hasLocalAuthentication() &&
                !hasExternalAuthentication()) {
            throw new IllegalStateException(
                    "L'utente deve avere almeno un metodo di autenticazione"
            );
        }
    }
}

