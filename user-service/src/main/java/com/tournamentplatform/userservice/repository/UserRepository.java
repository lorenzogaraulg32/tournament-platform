package com.tournamentplatform.userservice.repository;

import com.tournamentplatform.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);
}
