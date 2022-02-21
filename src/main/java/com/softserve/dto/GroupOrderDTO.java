package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class GroupOrderDTO extends GroupDTO{

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long afterId;
}
