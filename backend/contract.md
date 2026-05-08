# API Endpoints & Standalone Contract

All endpoints are prefixed with `/api/v1`. This document contains all necessary JSON structures and error codes for frontend implementation.

---

## 1. Authentication & Registration

### POST `/auth/register`
**Description**: Scenario #1-3. Atomically registers a user and their company.

**Request Body**:
```json
{
  "firstName": "String",
  "lastName": "String",
  "email": "user@example.com",
  "password": "secretPassword123", // Min 8 chars
  "companyName": "Acme Corp",
  "companyAddress": "123 Business St, Warsaw",
  "nip": "1234567890" // 10 digits
}
```

**Responses**:
- `201 Created`: Success.
  ```json
  { "token": "JWT_STRING", "email": "String", "firstName": "String", "lastName": "String" }
  ```
- `400 Bad Request`: Scenario #2. Validation failed (e.g., invalid NIP format, empty fields).
  ```json
  {
    "status": 400, "error": "Bad Request", "message": "Validation failed",
    "validationErrors": { "nip": "NIP must be 10 digits", "email": "Invalid email format" }
  }
  ```
- `409 Conflict`: Scenario #3. Company with this NIP or User with this Email already exists.
  ```json
  { "status": 409, "error": "Conflict", "message": "Company or User already registered" }
  ```

### POST `/auth/login`
**Request Body**:
```json
{ "email": "user@example.com", "password": "password" }
```
**Responses**:
- `200 OK`: Success.
- `401 Unauthorized`: Invalid credentials.

---

## 2. Profile & Companies

### GET `/users/me`
**Response**: `200 OK`
```json
{
  "uuid": "USER_UUID",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "company": {
    "uuid": "COMP_UUID",
    "name": "Acme Corp",
    "nip": "1234567890",
    "address": "123 Business St",
    "description": "Optional description",
    "logoUrl": "https://cdn.example.com/logo.png"
  }
}
```

### PATCH `/companies/my`
**Description**: Scenario #4. Updates profile customization fields.
**Request Body**:
```json
{ "description": "New company description", "logoUrl": "https://new-url.com/logo.png" }
```
**Response**: `200 OK`

---

## 3. Negotiations (Contracts)

### GET `/contracts`
**Description**: Dashboard view (Scenario #1 Handling).
**Response**: `200 OK` (Paginated)
```json
{
  "content": [{
    "uuid": "CONTRACT_UUID",
    "status": "IN_PROGRESS",
    "senderCompanyName": "Acme Corp",
    "recipientCompanyName": "Global Soft",
    "initialOffering": "",
    "updatedAt": "2026-05-07T12:00:00Z"
  }]
}
```

### POST `/contracts`
**Description**: Scenario #1-2 Sending. Initiates a new negotiation.
**Request Body**:
```json
{
  "recipientCompanyUuid": "UUID",
  "title": "Initial Offer",
  "description": "Full project terms...",
  "price": 5000.00,
  "currency": "USD",
  "deadline": "2026-12-31T23:59:59Z"
}
```
**Responses**:
- `201 Created`: Success.
- `400 Bad Request`: Scenario #2 Sending. Invalid price (negative) or past deadline.

### POST `/contracts/{uuid}/shards`
**Description**: Scenario #1-3 Counteroffers.
**Request Body**:
```json
{ "title": "Updated Title", "description": "New terms", "price": 4500.00, "currency": "USD", "deadline": "2026-11-30T00:00:00Z" }
```
**Responses**:
- `201 Created`: Success.
- `400 Bad Request`: Scenario #3 Counteroffers. Negotiation is already `ACCEPTED` or `REJECTED`.
  ```json
  { "status": 400, "error": "Bad Request", "message": "Negotiation is already resolved" }
  ```

### PATCH `/contracts/{uuid}/status`
**Description**: Scenario #2-5 Handling. Accept or Reject the offer.
**Request Body**:
```json
{ "status": "ACCEPTED" } // Or "REJECTED"
```
**Responses**:
- `200 OK`: Success.
- `400 Bad Request`: Scenario #4-5 Handling. Decision already made.
  ```json
  { "status": 400, "error": "Bad Request", "message": "Negotiations have already started/finished" }
  ```
