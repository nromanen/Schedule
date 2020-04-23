package com.softserve.entity;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "class_name",
        "status"
})
public class Wish implements Serializable
{

    @JsonProperty("class_name")
    private String periodName;

    @JsonProperty("status")
    private String status;

    @JsonIgnore
    private static final long serialVersionUID = -1925390674796259490L;

    public Wish withPeriodName(String periodName) {
        this.periodName = periodName;
        return this;
    }

    public Wish withStatus(String status) {
        this.status = status;
        return this;
    }

}