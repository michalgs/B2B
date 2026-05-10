package com.example.b2b.mapper;

import com.example.b2b.dto.ContractResponse;
import com.example.b2b.model.Company;
import com.example.b2b.model.Contract;
import com.example.b2b.model.ContractShard;
import com.example.b2b.model.ContractStatus;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ContractMapperTest {

    private final ContractMapper mapper = new ContractMapper();

    @Test
    void toResponse_NullInput_ReturnsNull() {
        assertNull(mapper.toResponse(null));
    }

    @Test
    void toResponse_NoShards_ReturnsSummaryWithEmptyOffering() {
        Contract contract = Contract.builder()
                .uuid(UUID.randomUUID())
                .status(ContractStatus.INVITED)
                .sender(Company.builder().name("Sender").build())
                .recipient(Company.builder().name("Recipient").build())
                .shards(Collections.emptyList())
                .updatedAt(LocalDateTime.now())
                .build();

        ContractResponse dto = mapper.toResponse(contract);

        assertNotNull(dto);
        assertEquals("", dto.getInitialOffering());
        assertEquals("Sender", dto.getSenderCompanyName());
    }

    @Test
    void toResponse_WithShards_ReturnsOfferingFromFirstShard() {
        LocalDateTime now = LocalDateTime.now();
        ContractShard shard1 = ContractShard.builder().createdAt(now).title("First").price(BigDecimal.ONE).build();
        ContractShard shard2 = ContractShard.builder().createdAt(now.plusMinutes(1)).title("Latest").price(BigDecimal.TEN).build();

        Contract contract = Contract.builder()
                .uuid(UUID.randomUUID())
                .status(ContractStatus.INVITED)
                .sender(Company.builder().name("Sender").build())
                .recipient(Company.builder().name("Recipient").build())
                .shards(List.of(shard1, shard2))
                .updatedAt(now)
                .build();

        ContractResponse dto = mapper.toResponse(contract);

        assertNotNull(dto);
        assertEquals("First ($1)", dto.getInitialOffering());
    }
}
