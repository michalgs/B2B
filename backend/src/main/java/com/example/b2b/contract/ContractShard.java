package com.example.b2b.contract;

import com.example.b2b.company.Company;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contract_shards")
public class ContractShard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    private Long id;

    @Column(unique = true, nullable = false)
    @ToString.Include
    @EqualsAndHashCode.Include
    private UUID uuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private Company createdBy;

    @Column(nullable = false)
    @ToString.Include
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    @ToString.Include
    private String description;

    @Column(nullable = false, precision = 19, scale = 4)
    @ToString.Include
    private BigDecimal price;

    @Column(nullable = false, length = 3)
    @ToString.Include
    private String currency;

    @Column(nullable = false)
    @ToString.Include
    private LocalDateTime deadline;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    @ToString.Include
    private LocalDateTime createdAt;
}

