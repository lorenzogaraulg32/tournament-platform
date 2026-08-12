package com.tournamentplatform.userservice.entity.utils;

import com.tournamentplatform.userservice.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "user_sport_roles",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "sport", "role"})
)
@Getter
@Setter
public class UserSportRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Sport sport;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SportRole role;

}