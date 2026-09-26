# Schedule API Documentation

Documentation for frontend developers to integrate the **Schedules** endpoints.

---

## 1. Overview & Authentication

- **Base URL**: `{{baseUrl}}/schedules` (e.g. `http://localhost:3000/api/v1/schedules`)
- **Authentication**: Bearer Token required on all endpoints.
- **Allowed Roles**: 
  - Admin/Manager routes: `ORG_OWNER`, `ORG_ADMIN`, `MANAGER`
  - Technician routes: `TECHNICIAN`
- **Tenant Scoping**: All queries and mutations are automatically scoped to the authenticated user's organization.

### Request Headers
```http
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

---

## 2. API Endpoints Summary

### Manager / Admin Endpoints
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/schedules` | Create a new schedule for a service request | `201 Created` |
| `GET` | `/api/v1/schedules` | List all schedules in the organization | `200 OK` |
| `GET` | `/api/v1/schedules/services/:serviceId` | Get schedule by Service Request ID | `200 OK` |
| `GET` | `/api/v1/schedules/:id` | Get details of a single schedule by ID | `200 OK` |
| `PATCH` | `/api/v1/schedules/:id` | Update scheduled times and notes | `200 OK` |
| `DELETE` | `/api/v1/schedules/:id` | Delete a schedule by ID | `204 No Content` |

### Technician Endpoints
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/schedules/technician` | Get assigned schedules with customer and address details | `200 OK` |
| `PATCH` | `/api/v1/schedules/technician/:id/status` | Update schedule status and notes | `200 OK` |

---

## 3. Endpoints Detail

### 1. Create Schedule

Creates a schedule linking an existing service request to a technician. Upon creation, the linked service request status is automatically updated to `SCHEDULED`.

```http request
POST {{baseUrl}}/schedules
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "serviceRequestId": 12,
  "technicianId": 4,
  "scheduledStart": "2026-10-01T09:00:00.000Z",
  "scheduledEnd": "2026-10-01T11:00:00.000Z",
  "notes": "Customer requested technician call 15 minutes before arrival."
}
```

#### Request Body Schema
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `serviceRequestId` | `number` (integer) | **Yes** | Must be a positive integer matching an existing service request in your org. |
| `technicianId` | `number` (integer) | **Yes** | Must be a positive integer matching an existing technician in your org. |
| `scheduledStart` | `string` (ISO 8601) | **Yes** | Start timestamp (e.g. `"2026-10-01T09:00:00.000Z"`). |
| `scheduledEnd` | `string` (ISO 8601) | **Yes** | End timestamp (e.g. `"2026-10-01T11:00:00.000Z"`). |
| `notes` | `string` | No | Optional notes or instructions for the schedule. |

#### Response (201 Created)
```json
{
  "id": 1,
  "organizationId": 1,
  "serviceRequestId": 12,
  "technicianId": 4,
  "scheduledStart": "2026-10-01T09:00:00.000Z",
  "scheduledEnd": "2026-10-01T11:00:00.000Z",
  "status": "SCHEDULED",
  "notes": "Customer requested technician call 15 minutes before arrival.",
  "createdAt": "2026-09-25T10:30:00.000Z",
  "updatedAt": "2026-09-25T10:30:00.000Z"
}
```

#### Error Responses
- **404 Not Found** - Technician not found in organization:
  ```json
  {
    "success": false,
    "message": "technician not found",
    "code": "TECHNICIAN_NOT_FOUND"
  }
  ```
- **404 Not Found** - Service request not found in organization:
  ```json
  {
    "success": false,
    "message": "service does not exist",
    "code": "SERVICE_NOT_FOUND"
  }
  ```
- **409 Conflict** - Schedule already exists for this service request:
  ```json
  {
    "success": false,
    "message": "schedule already exists",
    "code": "SCHEDULE_CONFLICT"
  }
  ```

---

### 2. Get All Schedules

Retrieves all schedules for the authenticated user's organization.

```http request
GET {{baseUrl}}/schedules
Authorization: Bearer {{accessToken}}
```

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "organizationId": 1,
    "serviceRequestId": 12,
    "technicianId": 4,
    "scheduledStart": "2026-10-01T09:00:00.000Z",
    "scheduledEnd": "2026-10-01T11:00:00.000Z",
    "status": "SCHEDULED",
    "notes": "Customer requested technician call 15 minutes before arrival.",
    "createdAt": "2026-09-25T10:30:00.000Z",
    "updatedAt": "2026-09-25T10:30:00.000Z"
  }
]
```

---

### 3. Get Schedule by Service Request ID

Retrieves the schedule linked to a specific service request ID.

```http request
GET {{baseUrl}}/schedules/services/12
Authorization: Bearer {{accessToken}}
```

#### Parameters
| Parameter | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `serviceId` | Path | `number` (integer) | **Yes** | Service Request ID |

#### Response (200 OK)
```json
{
  "id": 1,
  "organizationId": 1,
  "serviceRequestId": 12,
  "technicianId": 4,
  "scheduledStart": "2026-10-01T09:00:00.000Z",
  "scheduledEnd": "2026-10-01T11:00:00.000Z",
  "status": "SCHEDULED",
  "notes": "Customer requested technician call 15 minutes before arrival.",
  "createdAt": "2026-09-25T10:30:00.000Z",
  "updatedAt": "2026-09-25T10:30:00.000Z"
}
```

#### Error Responses
- **404 Not Found** - Schedule not found for this service request:
  ```json
  {
    "success": false,
    "message": "Schedule not found",
    "code": "SCHEDULE_NOT_FOUND"
  }
  ```

---

### 4. Get Schedule by ID

Retrieves details of a single schedule by its schedule ID.

```http request
GET {{baseUrl}}/schedules/1
Authorization: Bearer {{accessToken}}
```

#### Parameters
| Parameter | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Path | `number` (integer) | **Yes** | Schedule ID |

#### Response (200 OK)
```json
{
  "id": 1,
  "organizationId": 1,
  "serviceRequestId": 12,
  "technicianId": 4,
  "scheduledStart": "2026-10-01T09:00:00.000Z",
  "scheduledEnd": "2026-10-01T11:00:00.000Z",
  "status": "SCHEDULED",
  "notes": "Customer requested technician call 15 minutes before arrival.",
  "createdAt": "2026-09-25T10:30:00.000Z",
  "updatedAt": "2026-09-25T10:30:00.000Z"
}
```

#### Error Responses
- **404 Not Found**:
  ```json
  {
    "success": false,
    "message": "Schedule not found",
    "code": "SCHEDULE_NOT_FOUND"
  }
  ```

---

### 5. Update Schedule (Manager)

Updates the scheduled time window and/or notes of an existing schedule.

```http request
PATCH {{baseUrl}}/schedules/1
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "scheduledStart": "2026-10-01T10:00:00.000Z",
  "scheduledEnd": "2026-10-01T12:00:00.000Z",
  "notes": "Rescheduled by 1 hour on customer request."
}
```

#### Parameters
| Parameter | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Path | `number` (integer) | **Yes** | Schedule ID to update |

#### Request Body Schema
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `scheduledStart` | `string` (ISO 8601) | **Yes** | New start timestamp. |
| `scheduledEnd` | `string` (ISO 8601) | **Yes** | New end timestamp. |
| `notes` | `string` | No | Updated notes. |

#### Response (200 OK)
```json
{
  "id": 1,
  "organizationId": 1,
  "serviceRequestId": 12,
  "technicianId": 4,
  "scheduledStart": "2026-10-01T10:00:00.000Z",
  "scheduledEnd": "2026-10-01T12:00:00.000Z",
  "status": "SCHEDULED",
  "notes": "Rescheduled by 1 hour on customer request.",
  "createdAt": "2026-09-25T10:30:00.000Z",
  "updatedAt": "2026-09-25T11:00:00.000Z"
}
```

#### Error Responses
- **404 Not Found**:
  ```json
  {
    "success": false,
    "message": "Schedule not found",
    "code": "SCHEDULE_NOT_FOUND"
  }
  ```

---

### 6. Delete Schedule

Deletes a schedule by ID.

```http request
DELETE {{baseUrl}}/schedules/1
Authorization: Bearer {{accessToken}}
```

#### Parameters
| Parameter | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Path | `number` (integer) | **Yes** | Schedule ID to delete |

#### Response (204 No Content)
Empty body.

#### Error Responses
- **404 Not Found**:
  ```json
  {
    "success": false,
    "message": "Schedule not found",
    "code": "SCHEDULE_NOT_FOUND"
  }
  ```

---

### 7. Get Technician Schedules

Retrieves all schedules assigned to the authenticated technician, complete with customer contact info (`name`, `phone`, `email`) and site address details (`addressLine1`, `addressLine2`, `city`, `state`, `postalCode`).

```http request
GET {{baseUrl}}/schedules/technician
Authorization: Bearer {{accessToken}}
```

#### Query Parameters
| Parameter | Type | Required | Allowed Values | Description |
| :--- | :--- | :--- | :--- | :--- |
| `status` | `string` | No | `SCHEDULED`, `DISPATCHED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` | Optional filter by status. |

**Example filtered request:**
```http request
GET {{baseUrl}}/schedules/technician?status=SCHEDULED
Authorization: Bearer {{accessToken}}
```

#### Response (200 OK)
```json
[
  {
    "id": 10,
    "organizationId": 1,
    "serviceRequestId": 25,
    "technicianId": 4,
    "scheduledStart": "2026-10-01T09:00:00.000Z",
    "scheduledEnd": "2026-10-01T11:00:00.000Z",
    "status": "SCHEDULED",
    "notes": "Gate code is #4321.",
    "customer": {
      "id": 14,
      "organizationId": 1,
      "name": "Jane Cooper",
      "phone": "+1-555-0143",
      "email": "jane.cooper@example.com"
    },
    "address": {
      "id": 8,
      "customerId": 14,
      "addressLine1": "742 Evergreen Terrace",
      "addressLine2": "Suite 4B",
      "city": "Springfield",
      "state": "IL",
      "postalCode": "62704",
      "country": "USA"
    },
    "serviceRequest": {
      "id": 25,
      "title": "HVAC Cooling Unit Malfunction",
      "description": "System blowing ambient air.",
      "category": "REPAIR",
      "priority": "HIGH",
      "status": "SCHEDULED"
    },
    "createdAt": "2026-09-30T15:00:00.000Z",
    "updatedAt": "2026-09-30T15:00:00.000Z"
  }
]
```

---

### 8. Update Technician Schedule Status

Allows a technician to update the status of their assigned schedule and add job notes.

```http request
PATCH {{baseUrl}}/schedules/technician/10/status
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "status": "COMPLETED",
  "notes": "Replaced fuse and tested system. Working properly."
}
```

#### Parameters
| Parameter | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Path | `number` (integer) | **Yes** | Schedule ID assigned to the technician |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `status` | `string` | **Yes** | New status: `SCHEDULED`, `DISPATCHED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| `notes` | `string` | No | Optional technician progress/completion notes. |

#### Business Rules
- **Cannot Update Cancelled Schedule**: If the schedule status is already `CANCELLED`, updating throws `400 Bad Request` (`SCHEDULE_NOT_UPDATABLE`).
- **Scoped to Technician**: Technicians can only update their own assigned schedules. Others return `404 Not Found`.

#### Response (200 OK)
```json
{
  "id": 10,
  "organizationId": 1,
  "serviceRequestId": 25,
  "technicianId": 4,
  "scheduledStart": "2026-10-01T09:00:00.000Z",
  "scheduledEnd": "2026-10-01T11:00:00.000Z",
  "status": "COMPLETED",
  "notes": "Replaced fuse and tested system. Working properly.",
  "createdAt": "2026-09-30T15:00:00.000Z",
  "updatedAt": "2026-10-01T10:45:00.000Z"
}
```

---

## 4. TypeScript Types for Frontend

```typescript
export enum ScheduleStatus {
  SCHEDULED = 'SCHEDULED',
  DISPATCHED = 'DISPATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface CustomerSummary {
  id: number;
  name: string;
  phone?: string;
  email: string;
}

export interface AddressSummary {
  id: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Schedule {
  id: number;
  organizationId: number;
  serviceRequestId: number;
  technicianId: number;
  scheduledStart: string; // ISO 8601 string
  scheduledEnd: string;   // ISO 8601 string
  status: ScheduleStatus;
  notes?: string;
  customer?: CustomerSummary;
  address?: AddressSummary;
  serviceRequest?: any;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTechnicianScheduleStatusPayload {
  status: ScheduleStatus;
  notes?: string;
}
```

---

## 5. Common Error Reference

| HTTP Status | Error Code | Description |
| :--- | :--- | :--- |
| `400 Bad Request` | `SCHEDULE_NOT_UPDATABLE` | Attempted to update a schedule that is already `CANCELLED` |
| `401 Unauthorized` | `AUTH_HEADER_MISSING` / `INVALID_BEARER_TOKEN` | Bearer token is missing or expired |
| `403 Forbidden` | `FORBIDDEN_RESOURCE` | Authenticated user lacks required role for the endpoint |
| `404 Not Found` | `TECHNICIAN_NOT_FOUND` | Technician ID or technician profile does not exist |
| `404 Not Found` | `SERVICE_NOT_FOUND` | Service request ID does not exist in the organization |
| `404 Not Found` | `SCHEDULE_NOT_FOUND` | Schedule ID does not exist or does not belong to the technician |
| `409 Conflict` | `SCHEDULE_CONFLICT` | Service request is already scheduled |
