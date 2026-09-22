package com.tournamentplatform.userservice.client.authService;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(
        name = "auth-service",
        configuration = AuthServiceFeignConfig.class
)
public interface AuthServiceClient {

    @DeleteMapping("/auth/internal/users/{userId}")
    void deleteUser(@PathVariable("userId") String userId);

    @PostMapping("/auth/internal/revocations/{userId}")
    void revokeSubject(
            @PathVariable("userId") String userId
    );

    @DeleteMapping("/auth/internal/revocations/{userId}")
    void restoreSubject(
            @PathVariable("userId") String userId
    );
}