package com.softserve.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "day_of_week",
        "evenOdd",
        "wishes"
})
public class Wishes implements Serializable
{

    @JsonProperty("day_of_week")
    private String dayOfWeek;

    @JsonProperty("evenOdd")
    private String evenOdd;

    @JsonProperty("wishes")
    private List<Wish> wishes = new ArrayList<Wish>();

    @JsonProperty("day_of_week")
    public String getDayOfWeek() {
        return dayOfWeek;
    }

    @JsonProperty("day_of_week")
    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public Wishes withDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
        return this;
    }

    @JsonProperty("evenOdd")
    public String getEvenOdd() {
        return evenOdd;
    }

    @JsonProperty("evenOdd")
    public void setEvenOdd(String evenOdd) {
        this.evenOdd = evenOdd;
    }

    public Wishes withEvenOdd(String evenOdd) {
        this.evenOdd = evenOdd;
        return this;
    }

    @JsonProperty("wishes")
    public List<Wish> getWishes() {
        return wishes;
    }

    @JsonProperty("wishes")
    public void setWishes(List<Wish> wishes) {
        this.wishes = wishes;
    }

    public Wishes withWishes(List<Wish> wishes) {
        this.wishes = wishes;
        return this;
    }
}