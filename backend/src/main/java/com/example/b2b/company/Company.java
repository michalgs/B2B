package com.example.b2b.company;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

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
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    private Long id;

    @Column(unique = true, nullable = false)
    @ToString.Include
    @EqualsAndHashCode.Include
    private UUID uuid;

    @Column(nullable = false)
    @ToString.Include
    private String name;

    @Column(unique = true, nullable = false)
    @ToString.Include
    private String nip;

    @Column(nullable = false)
    @ToString.Include
    private String address;

    @Column(columnDefinition = "TEXT")
    @ToString.Include
    private String description;

    @ToString.Include
    private String logoUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    @ToString.Include
    private LocalDateTime createdAt;
}

