package com.softserve.entity;

import java.io.Serializable;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.softserve.entity.enums.EvenOdd;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "day_of_week",
        "evenOdd",
        "class_status"
})
public class Wishes implements Serializable
{

    @JsonProperty("day_of_week")
    private String dayOfWeek;

    @JsonProperty("evenOdd")
    private String evenOdd;

    @JsonProperty("class_status")
    private List<Wish> wishes = new ArrayList<Wish>();

    public Wishes withDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
        return this;
    }

    public Wishes withEvenOdd(String evenOdd) {
        this.evenOdd = evenOdd;
        return this;
    }

    public Wishes withWishes(List<Wish> wishes) {
        this.wishes = wishes;
        return this;
    }
}