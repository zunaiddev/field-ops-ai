# Technician Schedules API Documentation

Documentation for frontend developers to integrate the **Technician Schedule Management** endpoints.

---

## 1. Overview & Authentication

- **Base URL**: `/api/v1/schedules`
- **Authentication**: Bearer Token required on all endpoints.
- **Allowed Roles**: `TECHNICIAN`
- **Scoping**: All queries and mutations are automatically scoped to the authenticated technician's organization and their assigned technician account.

### Request Headers
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

---

## 2. API Endpoints Summary

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/schedules/technician` | Get all schedules assigned to the logged-in technician (with customer & address details) | `200 OK` |
| `PATCH` | `/api/v1/schedules/technician/:id/status` | Update the status (and optional notes) of an assigned schedule | `200 OK` |

> **Note**: `PATCH /api/v1/schedules/technician/:id` is also accepted as an alias.

---

## 3. Endpoints Detail

### 1. Get Technician Schedules

Retrieves all schedules assigned to the authenticated technician. Each schedule includes complete customer contact information (`name`, `phone`, `email`) and site address details (`addressLine1`, `addressLine2`, `city`, `state`, `postalCode`, `country`) required for on-site navigation and communication.

```http request
GET {{baseUrl}}/schedules/technician
Authorization: Bearer {{accessToken}}
```

#### Optional Query Parameters

| Parameter | Type | Required | Allowed Values | Description |
| :--- | :--- | :--- | :--- | :--- |
| `status` | `string` | No | `SCHEDULED`, `DISPATCHED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` | Filter results by schedule status. |

**Example filtered request:**
```http request
GET {{baseUrl}}/schedules/technician?status=IN_PROGRESS
Authorization: Bearer {{accessToken}}
```

#### Response (`200 OK`)
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
    "notes": "Gate code is #4321. Call before entering.",
    "customer": {
      "id": 14,
      "organizationId": 1,
      "name": "Jane Cooper",
      "phone": "+1-555-0143",
      "email": "jane.cooper@example.com",
      "status": "ACTIVE"
    },
    "address": {
      "id": 8,
      "customerId": 14,
      "addressLine1": "742 Evergreen Terrace",
      "addressLine2": "Suite 4B",
      "city": "Springfield",
      "state": "IL",
      "postalCode": "62704",
      "country": "USA",
      "isPrimary": true
    },
    "serviceRequest": {
      "id": 25,
      "organizationId": 1,
      "customerId": 14,
      "addressId": 8,
      "createdBy": 2,
      "title": "HVAC Cooling Unit Malfunction",
      "description": "System blowing ambient air, error code E4 displayed on the thermostat.",
      "category": "REPAIR",
      "priority": "HIGH",
      "status": "SCHEDULED",
      "source": "CUSTOMER",
      "requestedAt": "2026-09-30T14:22:00.000Z",
      "customer": {
        "id": 14,
        "name": "Jane Cooper",
        "phone": "+1-555-0143",
        "email": "jane.cooper@example.com"
      },
      "address": {
        "id": 8,
        "addressLine1": "742 Evergreen Terrace",
        "addressLine2": "Suite 4B",
        "city": "Springfield",
        "state": "IL",
        "postalCode": "62704",
        "country": "USA"
      }
    },
    "createdAt": "2026-09-30T15:00:00.000Z",
    "updatedAt": "2026-09-30T15:00:00.000Z"
  }
]
```

#### Error Responses
- **400 Bad Request** - Invalid query parameter:
  ```json
  {
    "statusCode": 400,
    "message": [
      "status must be one of the following values: SCHEDULED, DISPATCHED, IN_PROGRESS, COMPLETED, CANCELLED"
    ],
    "error": "Bad Request"
  }
  ```
- **403 Forbidden** - User is not a technician:
  ```json
  {
    "statusCode": 403,
    "message": "You are not authorized to access this resource",
    "errorCode": "FORBIDDEN_RESOURCE"
  }
  ```
- **404 Not Found** - Technician profile not found for user:
  ```json
  {
    "statusCode": 404,
    "message": "Technician not found",
    "code": "TECHNICIAN_NOT_FOUND"
  }
  ```

---

### 2. Update Technician Schedule Status

Allows the technician to transition the schedule's status (e.g. marking `IN_PROGRESS`, `COMPLETED`, etc.) and record optional technician notes.

```http request
PATCH {{baseUrl}}/schedules/technician/10/status
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "status": "COMPLETED",
  "notes": "Replaced blown fuse and recharged refrigerant. System tested normal."
}
```

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `number` (integer) | **Yes** | Schedule ID |

#### Request Body Schema
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `status` | `string` | **Yes** | New status. Allowed: `SCHEDULED`, `DISPATCHED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| `notes` | `string` | No | Optional notes regarding job progress or completion details. |

#### Business Rules & Constraints
1. **Cancelled Schedule Lock**: If the schedule is already in `CANCELLED` status, it **cannot be updated**. The server will return `400 Bad Request` with code `SCHEDULE_NOT_UPDATABLE`.
2. **Technician Ownership**: Technicians can only update schedules assigned to their own account. Attempting to update another technician's schedule returns `404 Not Found`.
3. **Automatic Service Request Sync**:
   - Setting status to `COMPLETED` automatically sets the related service request to `RESOLVED`.
   - Setting status to `IN_PROGRESS` sets the service request to `IN_PROGRESS`.
   - Setting status to `CANCELLED` sets the service request to `ON_HOLD`.

#### Response (`200 OK`)
```json
{
  "id": 10,
  "organizationId": 1,
  "serviceRequestId": 25,
  "technicianId": 4,
  "scheduledStart": "2026-10-01T09:00:00.000Z",
  "scheduledEnd": "2026-10-01T11:00:00.000Z",
  "status": "COMPLETED",
  "notes": "Replaced blown fuse and recharged refrigerant. System tested normal.",
  "customer": {
    "id": 14,
    "name": "Jane Cooper",
    "phone": "+1-555-0143",
    "email": "jane.cooper@example.com"
  },
  "address": {
    "id": 8,
    "addressLine1": "742 Evergreen Terrace",
    "city": "Springfield",
    "state": "IL",
    "postalCode": "62704"
  },
  "createdAt": "2026-09-30T15:00:00.000Z",
  "updatedAt": "2026-10-01T10:45:00.000Z"
}
```

#### Error Responses
- **400 Bad Request** - Schedule is already cancelled and locked:
  ```json
  {
    "statusCode": 400,
    "message": "Cannot update a cancelled schedule",
    "code": "SCHEDULE_NOT_UPDATABLE"
  }
  ```
- **400 Bad Request** - Missing or invalid status in body:
  ```json
  {
    "statusCode": 400,
    "message": [
      "status must be one of the following values: SCHEDULED, DISPATCHED, IN_PROGRESS, COMPLETED, CANCELLED"
    ],
    "error": "Bad Request"
  }
  ```
- **404 Not Found** - Schedule does not exist or is not assigned to this technician:
  ```json
  {
    "statusCode": 404,
    "message": "Schedule not found",
    "code": "SCHEDULE_NOT_FOUND"
  }
  ```

---

## 4. TypeScript Interfaces for Frontend

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
  organizationId: number;
  name: string;
  phone?: string;
  email: string;
  externalReference?: string;
  status: string;
}

export interface AddressSummary {
  id: number;
  customerId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}

export interface TechnicianScheduleDto {
  id: number;
  organizationId: number;
  serviceRequestId: number;
  technicianId: number;
  scheduledStart: string; // ISO 8601
  scheduledEnd: string;   // ISO 8601
  status: ScheduleStatus;
  notes?: string;
  customer?: CustomerSummary;
  address?: AddressSummary;
  serviceRequest?: {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    customer?: CustomerSummary;
    address?: AddressSummary;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTechnicianScheduleStatusPayload {
  status: ScheduleStatus;
  notes?: string;
}

export interface GetTechnicianSchedulesQuery {
  status?: ScheduleStatus;
}
```
