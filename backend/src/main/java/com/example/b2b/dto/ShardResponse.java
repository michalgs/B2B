package com.example.b2b.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShardResponse {
    private UUID uuid;
    private String title;
    private String description;
    private BigDecimal price;
    private String currency;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;
    private String createdByName;
}
