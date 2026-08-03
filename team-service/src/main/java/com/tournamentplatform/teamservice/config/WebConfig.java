package com.tournamentplatform.teamservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

public class WebConfig implements WebMvcConfigurer {

    private final String teamLogosDirectory;

    public WebConfig(
            @Value("${app.uploads.team-logos-dir}")
            String teamLogosDirectory
    ) {
        this.teamLogosDirectory = teamLogosDirectory;
    }


    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {
        Path uploadPath = Paths
                .get(teamLogosDirectory)
                .toAbsolutePath()
                .normalize();

        registry
                .addResourceHandler("/teams/logos/**")
                .addResourceLocations(
                        uploadPath.toUri().toString()
                );
    }

}
