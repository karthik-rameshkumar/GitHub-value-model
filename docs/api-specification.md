# API Specification

## Base URL
- Development: `http://localhost:3001`
- Production: `https://api.essp-dashboard.example.com`

## Authentication

All API endpoints (except health checks and public endpoints) require authentication using JWT tokens.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Health Check Endpoints

### GET /health
Basic health check for the API service.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2023-07-01T12:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0"
}
```

### GET /health/db
Database connectivity health check.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2023-07-01T12:00:00.000Z",
  "pool": {
    "totalCount": 10,
    "idleCount": 8,
    "waitingCount": 0
  }
}
```

### GET /health/redis
Redis connectivity health check.

**Response:**
```json
{
  "status": "healthy",
  "redis": "connected",
  "response": "PONG",
  "timestamp": "2023-07-01T12:00:00.000Z"
}
```

### GET /health/all
Comprehensive health check for all services.

**Response:**
```json
{
  "status": "healthy",
  "checks": {
    "api": { "status": "healthy" },
    "database": { "status": "healthy" },
    "redis": { "status": "healthy" }
  },
  "timestamp": "2023-07-01T12:00:00.000Z",
  "uptime": 3600
}
```

## Authentication Endpoints

### POST /api/auth/login
Authenticate user with GitHub OAuth.

**Request:**
```json
{
  "code": "github_oauth_code",
  "state": "csrf_state_token"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "github_username",
    "name": "User Name",
    "email": "user@example.com",
    "avatar_url": "https://github.com/avatar.jpg"
  }
}
```

### POST /api/auth/refresh
Refresh JWT token.

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "token": "new_jwt_token_here"
}
```

### POST /api/auth/logout
Logout user and invalidate token.

**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

## Metrics Endpoints

### GET /api/metrics/deployment-frequency
Get deployment frequency metrics.

**Query Parameters:**
- `timeframe`: `7d`, `30d`, `90d`, `1y` (default: `30d`)
- `team`: Filter by team ID
- `repository`: Filter by repository

**Response:**
```json
{
  "success": true,
  "data": {
    "timeframe": "30d",
    "average_deployments_per_day": 2.5,
    "total_deployments": 75,
    "trend": "increasing",
    "daily_data": [
      {
        "date": "2023-07-01",
        "deployments": 3
      }
    ]
  }
}
```

### GET /api/metrics/lead-time
Get lead time for changes metrics.

**Query Parameters:**
- `timeframe`: `7d`, `30d`, `90d`, `1y` (default: `30d`)
- `team`: Filter by team ID
- `repository`: Filter by repository

**Response:**
```json
{
  "success": true,
  "data": {
    "timeframe": "30d",
    "average_lead_time_hours": 24.5,
    "median_lead_time_hours": 18.0,
    "trend": "decreasing",
    "distribution": {
      "p50": 18.0,
      "p75": 30.0,
      "p90": 48.0,
      "p95": 72.0
    }
  }
}
```

### GET /api/metrics/recovery-time
Get time to recovery metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "timeframe": "30d",
    "average_recovery_time_hours": 2.5,
    "median_recovery_time_hours": 1.5,
    "incident_count": 5,
    "mttr_trend": "stable"
  }
}
```

### GET /api/metrics/change-failure-rate
Get change failure rate metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "timeframe": "30d",
    "failure_rate_percentage": 5.2,
    "total_changes": 150,
    "failed_changes": 8,
    "trend": "decreasing"
  }
}
```

## Team Endpoints

### GET /api/teams
Get list of teams.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "team_id",
      "name": "Frontend Team",
      "description": "Responsible for user-facing applications",
      "members": [
        {
          "id": "user_id",
          "username": "developer1",
          "role": "lead"
        }
      ],
      "repositories": ["repo1", "repo2"]
    }
  ]
}
```

### GET /api/teams/:id
Get specific team details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "team_id",
    "name": "Frontend Team",
    "description": "Responsible for user-facing applications",
    "members": [],
    "repositories": [],
    "metrics": {
      "deployment_frequency": 2.5,
      "lead_time": 24.5,
      "recovery_time": 2.5,
      "change_failure_rate": 5.2
    }
  }
}
```

## Repository Endpoints

### GET /api/repositories
Get list of repositories.

**Query Parameters:**
- `team`: Filter by team ID
- `status`: `active`, `archived`, `all` (default: `active`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "repo_id",
      "name": "frontend-app",
      "full_name": "org/frontend-app",
      "description": "Main frontend application",
      "language": "TypeScript",
      "team_id": "team_id",
      "status": "active",
      "last_deployment": "2023-07-01T12:00:00.000Z"
    }
  ]
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error
- `503`: Service Unavailable

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Limit**: 100 requests per 15-minute window per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining in window
  - `X-RateLimit-Reset`: Window reset time

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

## Webhook Endpoints

### POST /api/webhooks/github
GitHub webhook endpoint for receiving repository events.

**Headers:**
```
X-GitHub-Event: push
X-GitHub-Delivery: uuid
X-Hub-Signature-256: signature
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```