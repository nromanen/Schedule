package com.softserve.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;


@Configuration
@EnableWebMvc
@ComponentScan(basePackages = {"com.softserve.*"})
public class WebMvcConfig implements WebMvcConfigurer {



    public void addResourceHandlers(ResourceHandlerRegistry registry) {

    }

    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }



}
