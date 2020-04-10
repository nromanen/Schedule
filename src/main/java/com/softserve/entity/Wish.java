package com.softserve.entity;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "class_id",
        "status"
})
public class Wish implements Serializable
{

    @JsonProperty("class_id")
    private long classId;

    @JsonProperty("status")
    private String status;

    @JsonIgnore
    private final static long serialVersionUID = -1925390674796259490L;

    @JsonProperty("class_id")
    public long getClassId() {
        return classId;
    }

    @JsonProperty("class_id")
    public void setClassId(long classId) {
        this.classId = classId;
    }

    public Wish withClassId(long classId) {
        this.classId = classId;
        return this;
    }

    @JsonProperty("status")
    public String getStatus() {
        return status;
    }

    @JsonProperty("status")
    public void setStatus(String status) {
        this.status = status;
    }

    public Wish withStatus(String status) {
        this.status = status;
        return this;
    }

}