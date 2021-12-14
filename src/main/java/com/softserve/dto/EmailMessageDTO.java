package com.softserve.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Data
@ToString(exclude = "attachments")
@EqualsAndHashCode(exclude = "attachments")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class EmailMessageDTO {
    private String subject;
    private String text;
    private MultipartFile attachments;
//    private List<MultipartFile> attachments;
    private List<String> receivers;
    private String folderId;

//    System.getProperty("java.io.tmpdir");

}
