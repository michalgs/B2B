package com.example.b2b.common;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class FlywayMigrationTest {

    @Autowired
    private Flyway flyway;

    @Test
    void testFlywayMigrationsApplied() {
        assertNotNull(flyway, "Flyway bean should be autoconfigured and injected");

        MigrationInfo[] migrations = flyway.info().all();
        assertTrue(migrations.length > 0, "There should be at least one migration");

        // Check all migrations to ensure none are failed or pending
        for (MigrationInfo migration : migrations) {
            assertEquals(org.flywaydb.core.api.MigrationState.SUCCESS, migration.getState(),
                "Migration " + migration.getVersion() + " (" + migration.getDescription() + ") should have succeeded");
        }
    }
}
