package com.tournamentplatform.userservice.client.teamService;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "team-service",
        configuration = TeamServiceFeignConfig.class
)
public interface TeamServiceClient {

    @DeleteMapping("/teams/internal/users/{userId}")
    void removeUserFromTeams(
            @PathVariable("userId") String userId
    );
}