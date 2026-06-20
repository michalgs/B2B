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
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contracts")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    private Long id;

    @Column(unique = true, nullable = false)
    @ToString.Include
    @EqualsAndHashCode.Include
    private UUID uuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private Company sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Company recipient;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @ToString.Include
    private ContractStatus status;

    @Version
    @Column(nullable = false)
    @ToString.Include
    private Long version;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ContractShard> shards = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    @ToString.Include
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    @ToString.Include
    private LocalDateTime updatedAt;
}

