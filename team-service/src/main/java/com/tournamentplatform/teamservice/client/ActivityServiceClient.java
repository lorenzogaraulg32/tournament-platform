package com.tournamentplatform.teamservice.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;


@Component
public class ActivityServiceClient {


    private final RestClient restClient;
    private final String activityServiceToken;




    public ActivityServiceClient(
            @LoadBalanced RestClient.Builder builder,
            @Value("${internal.activity-service.token}")
            String activityServiceToken
    ) {

        this.activityServiceToken = activityServiceToken;

        this.restClient = builder
                .baseUrl("http://activity-service")
                .build();
    }


    //qua devo inserire le post per il post delle attività
    //devo prevedere un meccanismo di retry nel caso il servizio fosse down
    //prendere spunto dal media service client



}
