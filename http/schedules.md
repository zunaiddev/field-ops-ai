# Schedule API Documentation

Documentation for frontend developers to integrate the **Schedules** endpoints.

---

## 1. Overview & Authentication

- **Base URL**: `{{baseUrl}}/schedules` (e.g. `http://localhost:3000/api/v1/schedules`)
- **Authentication**: Bearer Token required on all endpoints.
- **Allowed Roles**: `ORG_OWNER`, `ORG_ADMIN`, `MANAGER`.
- **Tenant Scoping**: All queries and mutations are automatically scoped to the authenticated user's organization.

### Request Headers
```http
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

---

## 2. API Endpoints Summary

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/schedules` | Create a new schedule for a service request | `201 Created` |
| `GET` | `/api/v1/schedules` | List all schedules in the organization | `200 OK` |
| `GET` | `/api/v1/schedules/services/:serviceId` | Get schedule by Service Request ID | `200 OK` |
| `GET` | `/api/v1/schedules/:id` | Get details of a single schedule by ID | `200 OK` |
| `PATCH` | `/api/v1/schedules/:id` | Update scheduled times and notes | `200 OK` |
| `DELETE` | `/api/v1/schedules/:id` | Delete a schedule by ID | `204 No Content` |

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

### 5. Update Schedule

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

## 4. TypeScript Types for Frontend

```typescript
export enum ScheduleStatus {
  SCHEDULED = 'SCHEDULED',
  DISPATCHED = 'DISPATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchedulePayload {
  serviceRequestId: number;
  technicianId: number;
  scheduledStart: string; // ISO 8601 string, e.g. new Date().toISOString()
  scheduledEnd: string;   // ISO 8601 string
  notes?: string;
}

export interface UpdateSchedulePayload {
  scheduledStart: string; // ISO 8601 string
  scheduledEnd: string;   // ISO 8601 string
  notes?: string;
}
```

---

## 5. Common Error Reference

| HTTP Status | Error Code | Description |
| :--- | :--- | :--- |
| `401 Unauthorized` | `AUTH_HEADER_MISSING` / `INVALID_BEARER_TOKEN` | Bearer token is missing or expired |
| `403 Forbidden` | `FORBIDDEN_RESOURCE` | Authenticated user lacks `ORG_OWNER`, `ORG_ADMIN`, or `MANAGER` role |
| `404 Not Found` | `TECHNICIAN_NOT_FOUND` | Technician ID does not exist in the organization |
| `404 Not Found` | `SERVICE_NOT_FOUND` | Service request ID does not exist in the organization |
| `404 Not Found` | `SCHEDULE_NOT_FOUND` | Schedule ID or schedule for the specified service request does not exist |
| `409 Conflict` | `SCHEDULE_CONFLICT` | Service request is already scheduled |
