package com.softserve.controller;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@Slf4j
public class FrontendController {

    @RequestMapping(path = {"/", "/login","/admin","/schedule", "/activation-page"})
    public String staticResource() {
        return "index";
    }
}
