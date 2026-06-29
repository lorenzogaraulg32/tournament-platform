package com.tournamentplatform.authservice.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private boolean enabled;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private GlobalRole globalRole;


    public AppUser(String email, String password, String username, boolean b, GlobalRole globalRole) {
    }
}
