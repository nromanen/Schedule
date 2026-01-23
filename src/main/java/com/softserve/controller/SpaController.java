package com.softserve.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    /**
     * Forwards all non-API requests to index.html for React Router.
     * Excludes: /api/**, /static/**, /assets/**, swagger-ui, actuator
     *
     * @return forward path to index.html
     */
    @GetMapping(value = {
            "/",
            "/login",
            "/admin",
            "/admin/**",
            "/schedule",
            "/schedule/**",
            "/activation-page"
    })
    public String forwardToReact() {
        return "forward:/index.html";
    }
}
