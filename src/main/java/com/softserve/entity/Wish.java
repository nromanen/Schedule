package com.softserve.entity;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.softserve.entity.enums.WishStatuses;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Setter
@Getter
@ToString
@EqualsAndHashCode
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "class_name",
        "status"
})
public class Wish implements Serializable
{

    @JsonProperty("class_name")
    private String className;

    @JsonProperty("status")
    private WishStatuses status;

    @JsonIgnore
    private static final long serialVersionUID = -1925390674796259490L;

    public Wish withClassName(String className) {
        this.className = className;
        return this;
    }

    public Wish withStatus(WishStatuses status) {
        this.status = status;
        return this;
    }

}