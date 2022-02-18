package com.softserve.dto;

import lombok.*;
import java.util.List;

@Data
@ToString(exclude = "attachmentsName")
@EqualsAndHashCode(exclude = "attachmentsName")
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor(access = AccessLevel.PUBLIC)
@Builder
public class EmailMessageDTO {
    private String subject;
    private String text;
    private List<String> receivers;
    private List<String> attachmentsName;
}
