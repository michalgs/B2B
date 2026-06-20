package com.example.b2b.contract;

import com.example.b2b.contract.ContractResponse;
import com.example.b2b.contract.ShardResponse;
import com.example.b2b.contract.Contract;
import com.example.b2b.contract.ContractShard;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.stream.Collectors;

@Component
public class ContractMapper {

    public ContractResponse toResponse(Contract contract) {
        if (contract == null) {
            return null;
        }

        // The current frontend expectation for "initialOffering" is a string summary
        // We derive it from the latest shard (the current offer)
        ContractShard latestShard = contract.getShards().stream()
                .max(Comparator.comparing(ContractShard::getCreatedAt))
                .orElse(null);

        String offering = "";
        if (latestShard != null) {
            offering = latestShard.getTitle() + " ($" + latestShard.getPrice() + ")";
        }

        return ContractResponse.builder()
                .uuid(contract.getUuid())
                .status(contract.getStatus())
                .senderCompanyName(contract.getSender().getName())
                .recipientCompanyName(contract.getRecipient().getName())
                .initialOffering(offering)
                .updatedAt(contract.getUpdatedAt())
                .shards(contract.getShards().stream()
                        .map(this::toShardResponse)
                        .sorted(Comparator.comparing(ShardResponse::getCreatedAt))
                        .collect(Collectors.toList()))
                .build();
    }

    private ShardResponse toShardResponse(ContractShard shard) {
        return ShardResponse.builder()
                .uuid(shard.getUuid())
                .title(shard.getTitle())
                .description(shard.getDescription())
                .price(shard.getPrice())
                .currency(shard.getCurrency())
                .deadline(shard.getDeadline())
                .createdAt(shard.getCreatedAt())
                .createdByName(shard.getCreatedBy().getName())
                .build();
    }
}


