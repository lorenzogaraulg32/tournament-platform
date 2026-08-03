package com.tournamentplatform.teamservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String teamLogosDirectory;

    public WebConfig(
            @Value("${app.uploads.team-logos-dir}")
            String teamLogosDirectory
    ) {
        this.teamLogosDirectory = teamLogosDirectory;
    }



}
