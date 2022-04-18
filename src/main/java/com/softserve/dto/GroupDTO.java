package com.softserve.dto;

import lombok.*;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class GroupDTO {
    private Long id;
    private Boolean disable;
    private String title;
}
