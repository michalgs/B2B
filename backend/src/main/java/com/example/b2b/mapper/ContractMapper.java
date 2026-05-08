package com.example.b2b.mapper;

import com.example.b2b.dto.ContractResponse;
import com.example.b2b.model.Contract;
import com.example.b2b.model.ContractShard;
import org.springframework.stereotype.Component;

import java.util.Comparator;

@Component
public class ContractMapper {

    public ContractResponse toResponse(Contract contract) {
        if (contract == null) {
            return null;
        }

        // The current frontend expectation for "initialOffering" is a string summary
        // We derive it from the first shard (the initial offer)
        ContractShard initialShard = contract.getShards().stream()
                .min(Comparator.comparing(ContractShard::getCreatedAt))
                .orElse(null);

        String offering = "";
        if (initialShard != null) {
            offering = initialShard.getTitle() + " ($" + initialShard.getPrice() + ")";
        }

        return ContractResponse.builder()
                .uuid(contract.getUuid())
                .status(contract.getStatus())
                .senderCompanyName(contract.getSender().getName())
                .recipientCompanyName(contract.getRecipient().getName())
                .initialOffering(offering)
                .updatedAt(contract.getUpdatedAt())
                .build();
    }
}
