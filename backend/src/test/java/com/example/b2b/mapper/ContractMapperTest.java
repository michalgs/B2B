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
    void toResponse_WithShards_ReturnsOfferingFromLatestShard() {
        LocalDateTime now = LocalDateTime.now();
        Company creator = Company.builder().name("Creator").build();
        ContractShard shard1 = ContractShard.builder().uuid(UUID.randomUUID()).createdAt(now).title("First").price(BigDecimal.ONE).currency("USD").createdBy(creator).build();
        ContractShard shard2 = ContractShard.builder().uuid(UUID.randomUUID()).createdAt(now.plusMinutes(1)).title("Latest").price(BigDecimal.TEN).currency("USD").createdBy(creator).build();

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
        assertEquals("Latest ($10)", dto.getInitialOffering());
        assertEquals(2, dto.getShards().size());
        assertEquals("Latest", dto.getShards().get(1).getTitle());
        assertEquals("Creator", dto.getShards().get(1).getCreatedByName());
    }

    @Test
    void toResponse_ShardsAreSortedByDate() {
        LocalDateTime now = LocalDateTime.now();
        Company creator = Company.builder().name("Creator").build();
        ContractShard shardOlder = ContractShard.builder().uuid(UUID.randomUUID()).createdAt(now.minusDays(1)).title("Old").price(BigDecimal.ONE).currency("USD").createdBy(creator).build();
        ContractShard shardNewer = ContractShard.builder().uuid(UUID.randomUUID()).createdAt(now).title("New").price(BigDecimal.TEN).currency("USD").createdBy(creator).build();

        Contract contract = Contract.builder()
                .uuid(UUID.randomUUID())
                .status(ContractStatus.INVITED)
                .sender(Company.builder().name("Sender").build())
                .recipient(Company.builder().name("Recipient").build())
                .shards(List.of(shardNewer, shardOlder))
                .updatedAt(now)
                .build();

        ContractResponse dto = mapper.toResponse(contract);

        assertEquals("Old", dto.getShards().get(0).getTitle());
        assertEquals("New", dto.getShards().get(1).getTitle());
    }
}
