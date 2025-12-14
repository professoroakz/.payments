# Task Value Ledger - API Design

This document outlines the REST API design for the Task Value Ledger system.

## Base URL

```
https://api.taskvalueled ger.com/v1
```

## Authentication

All requests require authentication via Bearer token:

```
Authorization: Bearer <token>
```

## Core Resources

### Workspaces

#### List workspaces
```http
GET /workspaces
```

Response:
```json
{
  "workspaces": [
    {
      "id": "ws-001",
      "name": "Acme Corp",
      "type": "company",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create workspace
```http
POST /workspaces
```

Request:
```json
{
  "name": "Acme Corp",
  "type": "company"
}
```

### Projects

#### List projects in workspace
```http
GET /workspaces/{workspaceId}/projects
```

#### Create project
```http
POST /workspaces/{workspaceId}/projects
```

Request:
```json
{
  "name": "Mobile App",
  "description": "iOS and Android app"
}
```

### Boards

#### List boards in project
```http
GET /projects/{projectId}/boards
```

#### Create board
```http
POST /projects/{projectId}/boards
```

### Cards (Tasks)

#### List cards in list
```http
GET /lists/{listId}/cards
```

#### Create card
```http
POST /lists/{listId}/cards
```

Request:
```json
{
  "title": "Implement user authentication",
  "description": "Add OAuth2 login",
  "type": "feature",
  "priority": "high",
  "complexity": 1.5,
  "estimatedHours": 8,
  "tags": ["auth", "security"],
  "acceptanceCriteria": [
    "Users can log in with Google",
    "Users can log in with GitHub",
    "Session persists for 30 days"
  ]
}
```

#### Update card
```http
PATCH /cards/{cardId}
```

#### Move card
```http
POST /cards/{cardId}/move
```

Request:
```json
{
  "listId": "list-002",
  "position": 1
}
```

### Time Tracking

#### Start timer
```http
POST /cards/{cardId}/time/start
```

Request:
```json
{
  "personId": "person-001",
  "roleType": "developer",
  "notes": "Starting implementation"
}
```

Response:
```json
{
  "timeEntryId": "time-001",
  "cardId": "card-001",
  "personId": "person-001",
  "roleType": "developer",
  "startTime": "2024-01-15T10:00:00Z",
  "status": "running"
}
```

#### Stop timer
```http
POST /cards/{cardId}/time/stop
```

Request:
```json
{
  "timeEntryId": "time-001",
  "notes": "Completed authentication flow"
}
```

Response:
```json
{
  "timeEntryId": "time-001",
  "durationSeconds": 14400,
  "endTime": "2024-01-15T14:00:00Z"
}
```

#### Log time manually
```http
POST /cards/{cardId}/time/log
```

Request:
```json
{
  "personId": "person-001",
  "roleType": "developer",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T14:00:00Z",
  "notes": "Worked on auth implementation"
}
```

#### Get time entries for card
```http
GET /cards/{cardId}/time
```

Response:
```json
{
  "timeEntries": [
    {
      "id": "time-001",
      "personId": "person-001",
      "roleType": "developer",
      "startTime": "2024-01-15T10:00:00Z",
      "endTime": "2024-01-15T14:00:00Z",
      "durationSeconds": 14400,
      "notes": "Worked on auth implementation"
    }
  ],
  "totalSeconds": 14400,
  "totalHours": 4.0
}
```

### Participants

#### Add participant to card
```http
POST /cards/{cardId}/participants
```

Request:
```json
{
  "personId": "person-001",
  "roleType": "developer",
  "weight": 0.70
}
```

#### Update participant weight
```http
PATCH /cards/{cardId}/participants/{personId}
```

Request:
```json
{
  "weight": 0.80
}
```

### Rate Plans

#### List rate plans for person
```http
GET /persons/{personId}/rate-plans
```

#### Create rate plan
```http
POST /persons/{personId}/rate-plans
```

Request:
```json
{
  "workspaceId": "ws-001",
  "type": "hourly",
  "baseRate": 75.00,
  "currency": "USD",
  "effectiveFrom": "2024-01-01T00:00:00Z",
  "overtimeMultiplier": 1.5,
  "nightDifferential": 0.15,
  "weekendDifferential": 0.20,
  "holidayDifferential": 0.50
}
```

#### Get active rate plan
```http
GET /persons/{personId}/rate-plans/active?workspaceId={workspaceId}&date={date}
```

### Cost Profiles

#### List cost profiles for workspace
```http
GET /workspaces/{workspaceId}/cost-profiles
```

#### Create cost profile
```http
POST /workspaces/{workspaceId}/cost-profiles
```

Request:
```json
{
  "country": "US",
  "name": "US Standard Employee Cost",
  "payrollBurdenRate": 0.30,
  "toolingCostPerMonth": 500,
  "overheadAllocationRate": 0.25,
  "contingencyRate": 0.10,
  "currency": "USD"
}
```

### Living Baselines

#### List living baselines for person
```http
GET /persons/{personId}/living-baselines
```

#### Create living baseline
```http
POST /persons/{personId}/living-baselines
```

Request:
```json
{
  "name": "Single Person - Urban US",
  "currency": "USD",
  "monthlyBreakdown": {
    "rent": 1800,
    "utilities": 150,
    "internetMobile": 100,
    "homeInsurance": 50,
    "healthExpenses": 300,
    "food": 500,
    "transportation": 200,
    "childcare": 0,
    "debtPayments": 200,
    "clothing": 100,
    "medicine": 50,
    "emergencyFundSavings": 300,
    "leisureSocial": 200,
    "taxesFees": 150
  },
  "effectiveFrom": "2024-01-01T00:00:00Z"
}
```

### Task Ledger

#### Post task to ledger (locks it)
```http
POST /cards/{cardId}/ledger/post
```

Request:
```json
{
  "qualityScore": 0.95,
  "reviewScore": 0.90,
  "approvedBy": "person-pm-001"
}
```

Response:
```json
{
  "ledgerEntryId": "entry-001",
  "cardId": "card-001",
  "postedAt": "2024-01-15T18:00:00Z",
  "isLocked": true,
  "valuationResult": {
    "taskId": "card-001",
    "totalLaborValue": 752.25,
    "totalEmployerCost": 1285.71,
    "currency": "USD",
    "participantPayouts": [...],
    "costBreakdown": {...},
    "calculatedAt": "2024-01-15T18:00:00Z"
  }
}
```

#### Get ledger entry
```http
GET /ledger/{ledgerEntryId}
```

#### Calculate valuation (preview without locking)
```http
POST /cards/{cardId}/valuation/preview
```

Request:
```json
{
  "qualityScore": 0.95,
  "complexity": 1.5
}
```

Response: Same as valuationResult above

### Reports

#### Get monthly coverage report
```http
GET /persons/{personId}/reports/coverage?month=2024-01&workspaceId={workspaceId}
```

Response:
```json
{
  "personId": "person-001",
  "period": "monthly",
  "month": "2024-01",
  "currency": "USD",
  "projectedGrossIncome": 11151.00,
  "projectedNetIncome": 8363.25,
  "requiredLivingCost": 4100.00,
  "coverageRatio": 2.04,
  "shortfall": 0,
  "surplus": 4263.25,
  "breakdown": [
    {
      "category": "Rent/Mortgage",
      "required": 1800.00,
      "covered": true
    },
    ...
  ],
  "generatedAt": "2024-01-31T23:59:59Z"
}
```

#### Get project cost report
```http
GET /projects/{projectId}/reports/costs?from={date}&to={date}
```

Response:
```json
{
  "projectId": "proj-001",
  "period": {
    "from": "2024-01-01T00:00:00Z",
    "to": "2024-01-31T23:59:59Z"
  },
  "summary": {
    "totalLaborValue": 45000.00,
    "totalEmployerCost": 77000.00,
    "currency": "USD"
  },
  "costBreakdown": {
    "directLabor": 45000.00,
    "payrollBurden": 13500.00,
    "toolingAllocation": 2500.00,
    "overheadAllocation": 11250.00,
    "contingency": 4750.00,
    "totalCost": 77000.00
  },
  "byRole": [
    {
      "roleType": "developer",
      "hours": 400,
      "laborValue": 30000.00,
      "employerCost": 51428.57
    },
    ...
  ]
}
```

#### Get person earnings report
```http
GET /persons/{personId}/reports/earnings?from={date}&to={date}&workspaceId={workspaceId}
```

Response:
```json
{
  "personId": "person-001",
  "period": {
    "from": "2024-01-01T00:00:00Z",
    "to": "2024-01-31T23:59:59Z"
  },
  "summary": {
    "totalHours": 160,
    "grossEarnings": 11151.00,
    "estimatedNetEarnings": 8363.25,
    "currency": "USD"
  },
  "byPaymentType": [
    {
      "type": "hourly_pay",
      "amount": 10500.00
    },
    {
      "type": "quality_bonus",
      "amount": 525.00
    },
    {
      "type": "overtime",
      "amount": 126.00
    }
  ],
  "byProject": [
    {
      "projectId": "proj-001",
      "projectName": "Mobile App",
      "hours": 120,
      "earnings": 8500.00
    },
    ...
  ]
}
```

#### Export report
```http
GET /reports/{reportType}/export?format={format}&...
```

Query params:
- `format`: `json`, `csv`, `pdf`
- Additional filters based on report type

### Payment Components

#### Calculate payment component
```http
POST /calculations/payment-components
```

Request:
```json
{
  "type": "overtime",
  "baseRate": 75.00,
  "hours": 2,
  "multiplier": 1.5
}
```

Response:
```json
{
  "type": "overtime",
  "amount": 225.00,
  "description": "Overtime: 2.0h at 1.5x",
  "calculationBasis": "75 * 2 * 1.5"
}
```

## Webhooks

Workspaces can register webhooks for various events:

### Events

- `card.created`
- `card.updated`
- `card.moved`
- `time.started`
- `time.stopped`
- `ledger.posted`
- `valuation.calculated`
- `report.generated`

### Register webhook
```http
POST /workspaces/{workspaceId}/webhooks
```

Request:
```json
{
  "url": "https://example.com/webhook",
  "events": ["ledger.posted", "valuation.calculated"],
  "secret": "webhook-secret-key"
}
```

## Rate Limiting

- 1000 requests per hour per API key
- 100 requests per minute per API key

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 998
X-RateLimit-Reset: 1705334400
```

## Error Responses

### 400 Bad Request
```json
{
  "error": {
    "code": "invalid_request",
    "message": "Invalid complexity value. Must be between 0.8 and 2.5",
    "field": "complexity"
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "code": "unauthorized",
    "message": "Invalid or expired token"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "code": "forbidden",
    "message": "You don't have permission to access this resource"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": "not_found",
    "message": "Card not found"
  }
}
```

### 409 Conflict
```json
{
  "error": {
    "code": "conflict",
    "message": "Task is already locked in the ledger"
  }
}
```

### 422 Unprocessable Entity
```json
{
  "error": {
    "code": "validation_error",
    "message": "Cannot post to ledger without time entries",
    "details": {
      "timeEntries": "At least one time entry is required"
    }
  }
}
```

### 429 Too Many Requests
```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 3600
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "code": "internal_error",
    "message": "An unexpected error occurred",
    "requestId": "req-12345"
  }
}
```

## Pagination

List endpoints support cursor-based pagination:

```http
GET /workspaces/{workspaceId}/projects?limit=20&cursor={cursor}
```

Response:
```json
{
  "data": [...],
  "pagination": {
    "hasMore": true,
    "nextCursor": "eyJpZCI6InByb2otMDIwIn0="
  }
}
```

## Filtering and Sorting

List endpoints support filtering and sorting:

```http
GET /cards?status=in_progress&priority=high&sort=-createdAt&limit=50
```

Query params:
- Field filters: `field=value` or `field[operator]=value`
- Operators: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`
- Sort: `sort=field` (ascending) or `sort=-field` (descending)
- Multiple sort: `sort=field1,-field2`

## Bulk Operations

### Bulk create time entries
```http
POST /time/bulk
```

Request:
```json
{
  "entries": [
    {
      "cardId": "card-001",
      "personId": "person-001",
      "roleType": "developer",
      "startTime": "2024-01-15T10:00:00Z",
      "endTime": "2024-01-15T14:00:00Z"
    },
    ...
  ]
}
```

### Bulk post to ledger
```http
POST /ledger/bulk-post
```

Request:
```json
{
  "cardIds": ["card-001", "card-002", "card-003"],
  "approvedBy": "person-pm-001"
}
```

## API Versioning

The API uses URL-based versioning:
- Current: `/v1`
- Deprecated versions remain available for 12 months after new version release
- Version sunset announcements via `X-API-Deprecation` header

## SDK Support

Official SDKs available for:
- JavaScript/TypeScript
- Python
- Go
- Ruby
- Java
- C#

Example (TypeScript):
```typescript
import { TaskValueLedgerClient } from '@payments/task-value-ledger-client';

const client = new TaskValueLedgerClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.taskvalueledger.com/v1'
});

// Start timer
const timeEntry = await client.time.start('card-001', {
  personId: 'person-001',
  roleType: 'developer'
});

// Stop timer
await client.time.stop('card-001', timeEntry.id);

// Calculate valuation
const valuation = await client.valuation.calculate('card-001', {
  qualityScore: 0.95
});

console.log(`Total labor value: ${valuation.totalLaborValue}`);
```
