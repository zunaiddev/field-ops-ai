export enum ServiceRequestSource {
    EMPLOYEE = "EMPLOYEE",
    CUSTOMER = "CUSTOMER",
}

export enum ServiceRequestCategory {
    NETWORK = 'NETWORK',
    INSTALLATION = 'INSTALLATION',
    REPAIR = 'REPAIR',
    MAINTENANCE = 'MAINTENANCE',
    INSPECTION = 'INSPECTION',
    OTHER = 'OTHER',
}

export enum ServiceRequestPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export enum ServiceRequestStatus {
    NEW = 'NEW',
    IN_PROGRESS = 'IN_PROGRESS',
    ON_HOLD = 'ON_HOLD',
    RESOLVED = 'RESOLVED',
    CANCELLED = 'CANCELLED',
}