package com.example.b2b.contract;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ContractCreateRequest {

    @NotNull
    private UUID recipientCompanyUuid;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @Positive
    private BigDecimal price;

    @NotBlank
    private String currency;

    @NotNull
    @Future
    private LocalDateTime deadline;
}

