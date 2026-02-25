package com.softserve.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GroupDTO implements Serializable {
    private Long id;
    @Builder.Default
    private Boolean disable = false;
    private String title;
}
