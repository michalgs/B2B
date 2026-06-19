package com.example.b2b.contract;

import com.example.b2b.contract.ContractStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
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
    private String initialOffering; 
    private LocalDateTime updatedAt;
    private List<ShardResponse> shards;
}


