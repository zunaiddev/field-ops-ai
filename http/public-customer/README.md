# Public Customer API Documentation

All endpoints in this section are scoped to the authenticated customer using `@UseGuards(CustomerGuard)`.
They require a Bearer token received from customer login (`POST /api/v1/auth/login/customer`).

**Base URL**: `{{baseUrl}}/public/customers`

---

## 1. Get Customer Profile

Retrieves the profile details and organization information of the authenticated customer.

```http request
GET {{baseUrl}}/public/customers
Authorization: Bearer {{accessToken}}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "organizationId": 1,
  "name": "Ricky",
  "phone": "9876543210",
  "email": "customer1@test.com",
  "externalReference": null,
  "status": "ACTIVE",
  "organization": {
    "id": 1,
    "name": "Northstar Logistics",
    "slug": "northstar-logistics",
    "status": "ACTIVE",
    "timezone": "America/Chicago",
    "currency": "USD",
    "createdAt": "2026-09-23T01:34:01.485Z",
    "updatedAt": "2026-09-23T01:34:01.485Z"
  },
  "createdAt": "2026-09-24T06:56:01.179Z",
  "updatedAt": "2026-09-25T00:41:24.291Z"
}
```

---

## 2. Update Customer Profile

Updates the current customer's profile name and/or phone number.

```http request
PATCH {{baseUrl}}/public/customers
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Ricky Martin",
  "phone": "9876543210"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "organizationId": 1,
  "name": "Ricky Martin",
  "phone": "9876543210",
  "email": "customer1@test.com",
  "externalReference": null,
  "status": "ACTIVE",
  "createdAt": "2026-09-24T06:56:01.179Z",
  "updatedAt": "2026-09-25T01:10:00.000Z"
}
```

> **Note:**
> - `name`: String, required, max length 150.
> - `phone`: String, optional, max length 30.

---

## 3. Get Customer Addresses

Retrieves all saved addresses for the authenticated customer.

```http request
GET {{baseUrl}}/public/customers/addresses
Authorization: Bearer {{accessToken}}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "customerId": 1,
    "addressLine1": "102 Silver Oak Residency, 3rd Cross",
    "addressLine2": "Koramangala 5th Block",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560095",
    "country": "India",
    "isPrimary": true,
    "createdAt": "2026-09-24T07:12:00.000Z",
    "updatedAt": "2026-09-24T07:12:00.000Z"
  }
]
```

---

## 4. Add Customer Address

Creates a new address associated with the authenticated customer.

```http request
POST {{baseUrl}}/public/customers/addresses
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "addressLine1": "Site No. 12, 4th Main Road",
  "addressLine2": "Indiranagar",
  "city": "Bengaluru",
  "state": "Karnataka",
  "postalCode": "560038",
  "country": "India",
  "isPrimary": false
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "customerId": 1,
  "addressLine1": "Site No. 12, 4th Main Road",
  "addressLine2": "Indiranagar",
  "city": "Bengaluru",
  "state": "Karnataka",
  "postalCode": "560038",
  "country": "India",
  "isPrimary": false,
  "createdAt": "2026-09-25T01:15:00.000Z",
  "updatedAt": "2026-09-25T01:15:00.000Z"
}
```

> **Validation Rules:**
> - `addressLine1`: Required, string, max 100 characters.
> - `addressLine2`: Optional, string, max 100 characters.
> - `city`: Required, string, max 100 characters.
> - `state`: Required, string, max 100 characters.
> - `postalCode`: Required, string, max 20 characters.
> - `country`: Required, string, max 100 characters.
> - `isPrimary`: Optional boolean.

---

## 5. Update Customer Address

Updates an existing address by its ID belonging to the authenticated customer.

```http request
PATCH {{baseUrl}}/public/customers/addresses/1
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "addressLine1": "102 Silver Oak Residency, 4th Cross",
  "addressLine2": "Koramangala 5th Block",
  "city": "Bengaluru",
  "state": "Karnataka",
  "postalCode": "560095",
  "country": "India",
  "isPrimary": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "customerId": 1,
  "addressLine1": "102 Silver Oak Residency, 4th Cross",
  "addressLine2": "Koramangala 5th Block",
  "city": "Bengaluru",
  "state": "Karnataka",
  "postalCode": "560095",
  "country": "India",
  "isPrimary": true,
  "createdAt": "2026-09-24T07:12:00.000Z",
  "updatedAt": "2026-09-25T01:20:00.000Z"
}
```

> **Notes & Error Cases:**
> - The address must belong to the logged-in customer.
> - If the address is not found or belongs to another customer, it returns:
>   - **Status:** `404 Not Found`
>   - **Body:** `{"message": "Address not found", "code": "ADDRESS_NOT_FOUND"}`

---

## 6. Delete Customer Address

Deletes an address by its ID belonging to the authenticated customer.

```http request
DELETE {{baseUrl}}/public/customers/addresses/1
Authorization: Bearer {{accessToken}}
```

**Response (200 OK):**
```
(Empty Body)
```

> **Notes & Error Cases:**
> - The address must belong to the logged-in customer.
> - If the address is not found or belongs to another customer, it returns:
>   - **Status:** `404 Not Found`
>   - **Body:** `{"message": "Address not found", "code": "ADDRESS_NOT_FOUND"}`

---

## 7. Get Customer Service Requests

Retrieves all service requests submitted by or for the authenticated customer.

```http request
GET {{baseUrl}}/public/customers/services
Authorization: Bearer {{accessToken}}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "organizationId": 1,
    "customerId": 1,
    "addressId": 1,
    "createdBy": 1,
    "title": "Fix Network Connectivity Issues",
    "description": "Intermittent loss of connection reported during peak hours.",
    "category": "REPAIR",
    "priority": "HIGH",
    "status": "NEW",
    "source": "CUSTOMER",
    "requestedAt": "2026-09-25T01:25:00.000Z",
    "slaDueAt": null,
    "createdAt": "2026-09-25T01:25:00.000Z",
    "updatedAt": "2026-09-25T01:25:00.000Z"
  }
]
```

---

## 8. Create Customer Service Request

Creates a new service request for the customer.

```http request
POST {{baseUrl}}/public/customers/services
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "customerId": 1,
  "addressId": 1,
  "title": "Install Fiber Optic Router",
  "description": "Customer requested new high-speed fiber internet setup and router configuration.",
  "category": "INSTALLATION",
  "priority": "HIGH"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "organizationId": 1,
  "customerId": 1,
  "addressId": 1,
  "createdBy": 1,
  "title": "Install Fiber Optic Router",
  "description": "Customer requested new high-speed fiber internet setup and router configuration.",
  "category": "INSTALLATION",
  "priority": "HIGH",
  "status": "NEW",
  "source": "CUSTOMER",
  "requestedAt": "2026-09-25T01:30:00.000Z",
  "slaDueAt": null,
  "createdAt": "2026-09-25T01:30:00.000Z",
  "updatedAt": "2026-09-25T01:30:00.000Z"
}
```

> **Notes & Validation Rules:**
> - `addressId`: Must be a valid address ID belonging to the current customer.
> - If `addressId` does not belong to the authenticated customer:
>   - **Status:** `404 Not Found`
>   - **Body:** `{"message": "Address not found", "code": "ADDRESS_NOT_FOUND"}`
> - The service automatically assigns:
>   - `status`: `NEW`
>   - `source`: `CUSTOMER`
>   - `createdBy`: Current customer ID
>   - `requestedAt`: Current timestamp
> - Allowed `category` values: `NETWORK`, `INSTALLATION`, `REPAIR`, `MAINTENANCE`, `INSPECTION`, `OTHER`.
> - Allowed `priority` values: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.

---

## 9. Update Customer Service Request

Updates an existing service request by ID.

```http request
PATCH {{baseUrl}}/public/customers/services/1
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "addressId": 1,
  "title": "Urgent: Fix Network Connectivity Issues",
  "description": "Intermittent loss of connection reported during peak hours. Connection drops frequently.",
  "category": "REPAIR",
  "priority": "CRITICAL",
  "status": "NEW"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "organizationId": 1,
  "customerId": 1,
  "addressId": 1,
  "createdBy": 1,
  "title": "Urgent: Fix Network Connectivity Issues",
  "description": "Intermittent loss of connection reported during peak hours. Connection drops frequently.",
  "category": "REPAIR",
  "priority": "CRITICAL",
  "status": "NEW",
  "source": "CUSTOMER",
  "requestedAt": "2026-09-25T01:25:00.000Z",
  "slaDueAt": null,
  "createdAt": "2026-09-25T01:25:00.000Z",
  "updatedAt": "2026-09-25T01:35:00.000Z"
}
```

> **Notes & Error Cases:**
> - The service request must belong to the authenticated customer (`findByIdAndCustomerId`). If not found:
>   - **Status:** `404 Not Found`
>   - **Body:** `{"message": "Service not found", "code": "SERVICE_NOT_FOUND"}`
> - If `addressId` is changed, the new address must exist and belong to the customer. If not:
>   - **Status:** `404 Not Found`
>   - **Body:** `{"message": "Address not found", "code": "ADDRESS_NOT_FOUND"}`

---

## 10. Delete Customer Service Request

Deletes a service request by ID.

```http request
DELETE {{baseUrl}}/public/customers/services/1
Authorization: Bearer {{accessToken}}
```

**Response (200 OK):**
```
(Empty Body)
```

> **Critical Notes & Error Cases:**
> - **Status Restriction:** A service request can **only** be deleted if its `status` is **`NEW`**. If the request is already in progress, on hold, resolved, or cancelled (`status !== 'NEW'`), the server rejects deletion:
>   - **Status:** `400 Bad Request`
>   - **Body:**
>     ```json
>     {
>       "message": "Service can't be deleted",
>       "code": "SERVICE_NOT_DELETABLE"
>     }
>     ```
> - If the service request does not exist or does not belong to the authenticated customer:
>   - **Status:** `404 Not Found`
>   - **Body:**
>     ```json
>     {
>       "message": "Service not found",
>       "code": "SERVICE_NOT_FOUND"
>     }
>     ```
