package com.softserve.controller;

import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@Slf4j
@Api(tags = "FrontEnd API")
public class FrontendController {

    @RequestMapping(path = {"/", "/login","/admin","/schedule", "/activation-page"})
    public String staticResource() {
        return "index";
    }

    @GetMapping("/1")
    public String greeting(Map<String, Object> model) {
        List<String> wordList = new ArrayList<>();
        wordList.add("test");
        wordList.add("test");
        wordList.add("test");
        model.put("wordList", wordList);
        return "test";
    }


}
