package com.example.b2b.dto;

import com.example.b2b.model.ContractStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractResponse {
    private UUID uuid;
    private ContractStatus status;
    private String senderCompanyName;
    private String recipientCompanyName;
    private String initialOffering; // Mapping title/price for backward compatibility or as per contract
    private LocalDateTime updatedAt;
}
