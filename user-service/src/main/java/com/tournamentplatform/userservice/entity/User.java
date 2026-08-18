package com.tournamentplatform.userservice.entity;

import com.tournamentplatform.userservice.entity.utils.Gender;
import com.tournamentplatform.userservice.entity.utils.GeoLocation;
import com.tournamentplatform.userservice.entity.utils.Sport;
import com.tournamentplatform.userservice.entity.utils.UserSportRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter

@NoArgsConstructor
@Table(name = "users")

@OnDelete(action = OnDeleteAction.CASCADE)
public class User {

    @Id
    @Column(name = "user_id", nullable = false, updatable = false)
    private String id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;


    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "user_sports",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "sport")
    private Set<Sport> sports = new HashSet<>();


    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<UserSportRole> roles = new HashSet<>();

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(
                    name = "label",
                    column = @Column(name = "location_label")
            ),
            @AttributeOverride(
                    name = "latitude",
                    column = @Column(name = "location_latitude")
            ),
            @AttributeOverride(
                    name = "longitude",
                    column = @Column(name = "location_longitude")
            )
    })
    private GeoLocation location;

    @Column(name = "profile_pic_url")
    private String profilePicUrl;

}
