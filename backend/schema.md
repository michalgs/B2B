# Data Objects & DTOs

## 1. Authentication & Profile

### RegisterRequest
```json
{
  "firstName": "String", // User's first name
  "lastName": "String", // User's last name
  "email": "String", // Unique email (login)
  "password": "String", // Min 8 chars
  "companyName": "String", // Legal name
  "companyAddress": "String", // HQ address
  "nip": "String" // 10-digit Tax ID
}
```

### AuthResponse
```json
{
  "token": "String", // JWT Access Token
  "email": "String",
  "firstName": "String",
  "lastName": "String"
}
```

### UserMeResponse
```json
{
  "uuid": "UUID",
  "email": "String",
  "firstName": "String",
  "lastName": "String",
  "company": "CompanyDto" // Nested Company object
}
```

### CompanyDto
```json
{
  "uuid": "UUID",
  "name": "String",
  "nip": "String",
  "address": "String",
  "description": "String | null",
  "logoUrl": "String | null"
}
```

---

## 2. Negotiations

### CreateContractRequest
```json
{
  "recipientCompanyUuid": "UUID",
  "title": "String",
  "description": "String",
  "price": "BigDecimal",
  "currency": "String", // ISO-4217 (e.g. "USD")
  "deadline": "ISO8601"
}
```

### CounterOfferRequest
```json
{
  "title": "String",
  "description": "String",
  "price": "BigDecimal",
  "currency": "String",
  "deadline": "ISO8601"
}
```

### ContractSummaryDto (Dashboard View)
```json
{
  "uuid": "UUID",
  "status": "Enum", // PENDING, NEGOTIATING, ACCEPTED, REJECTED
  "senderCompanyName": "String",
  "recipientCompanyName": "String",
  "latestShard": {
    "title": "String",
    "price": "BigDecimal",
    "currency": "String",
    "createdAt": "ISO8601"
  },
  "updatedAt": "ISO8601"
}
```

### ContractDto (Detail View)
```json
{
  "uuid": "UUID",
  "status": "Enum", // PENDING, NEGOTIATING, ACCEPTED, REJECTED
  "senderCompany": "CompanyDto",
  "recipientCompany": "CompanyDto",
  "history": ["ContractShardDto"], // List of all negotiation versions
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### ContractShardDto
```json
{
  "uuid": "UUID",
  "contractUuid": "UUID",
  "createdByCompanyUuid": "UUID",
  "title": "String",
  "description": "String",
  "price": "BigDecimal",
  "currency": "String",
  "deadline": "ISO8601",
  "createdAt": "ISO8601"
}
```
