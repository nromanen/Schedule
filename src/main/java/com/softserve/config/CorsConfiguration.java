package com.softserve.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
@PropertySource("classpath:cors.properties")
public class CorsConfiguration extends org.springframework.web.cors.CorsConfiguration {

    private final Environment environment;

    @Autowired
    public CorsConfiguration(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins(environment.getProperty("cors.localurl"), environment.getProperty("cors.herokuUrl")).allowedMethods("GET","POST","PUT", "DELETE");;
            }
        };
    }
}
