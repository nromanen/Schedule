package com.softserve.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record ScheduleStatusDTO(
        @Schema(description = "Whether schedule is published", example = "true")
        boolean published,

        @Schema(description = "Message shown when schedule is hidden", example = "Розклад з'явиться пізніше")
        String message
) {
}
