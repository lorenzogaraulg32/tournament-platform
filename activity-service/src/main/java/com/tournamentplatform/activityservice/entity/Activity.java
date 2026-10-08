package com.tournamentplatform.activityservice.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@MappedSuperclass
public abstract class Activity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime occurredAt;


    @Column(nullable = false, unique = true, updatable = false)
    private UUID eventId;


    protected Activity(UUID eventId) {
        this.eventId = eventId;
    }

    @PrePersist
    protected void onCreate() {
        occurredAt = LocalDateTime.now();
    }

}
