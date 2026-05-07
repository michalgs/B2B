# Database Schema

This document describes the database tables and their relationships.

### Table: `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | PK, AI | Internal primary key |
| `uuid` | UUID | Unique | Public identifier |
| `company_id` | BigInt | FK (companies.id) | Link to the employer |
| `email` | Varchar | Unique | Login credential |
| `password` | Varchar | Not Null | Hashed password |
| `first_name` | Varchar | Not Null | |
| `last_name` | Varchar | Not Null | |

### Table: `companies`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | PK, AI | Internal primary key |
| `uuid` | UUID | Unique | Public identifier |
| `name` | Varchar | Not Null | Legal company name |
| `nip` | Varchar(10) | Unique | Tax Identification Number |
| `address` | Varchar | Not Null | Physical address |
| `description` | Text | Nullable | Profile bio |
| `logo_url` | Varchar | Nullable | Path to logo image |
| `created_at` | Timestamp | Not Null | |

### Table: `contracts`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | PK, AI | Internal primary key |
| `uuid` | UUID | Unique | Public identifier |
| `sender_id` | BigInt | FK (companies.id) | Initiating company |
| `recipient_id` | BigInt | FK (companies.id) | Target company |
| `status` | Varchar | Not Null | State (e.g., PENDING, ACCEPTED) |
| `version` | Long | Not Null | Optimistic locking |
| `created_at` | Timestamp | Not Null | |
| `updated_at` | Timestamp | Not Null | |

### Table: `contract_shards`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | PK, AI | Internal primary key |
| `uuid` | UUID | Unique | Public identifier |
| `contract_id` | BigInt | FK (contracts.id) | Parent contract |
| `created_by_id` | BigInt | FK (companies.id) | Author of this version |
| `title` | Varchar | Not Null | |
| `description` | Text | Not Null | |
| `price` | Decimal(19,4) | Not Null | Financial value |
| `currency` | Varchar(3) | Not Null | ISO-4217 code |
| `deadline` | Timestamp | Not Null | |
| `created_at` | Timestamp | Not Null | |
