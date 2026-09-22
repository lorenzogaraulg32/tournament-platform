package com.tournamentplatform.userservice.repository;

import com.tournamentplatform.userservice.entity.User;
import com.tournamentplatform.userservice.entity.utils.DeletingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);


    @Modifying
    @Query("""
    UPDATE User u
    SET u.deletingStatus = :status
    WHERE u.id = :userId
""")
    int updateDeletingStatus(
            @Param("userId") String userId,
            @Param("status") DeletingStatus status
    );

    @Query("""
                SELECT u.id
                FROM User u
                WHERE u.deletingStatus = :status
            """)
    List<String> findIdsByDeletingStatus(
            @Param("status") DeletingStatus status
    );

}
