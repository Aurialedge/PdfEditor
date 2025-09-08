# PDF Editor API Documentation

This document provides detailed information about the PDF Editor API endpoints, request/response formats, and usage examples.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication. However, in a production environment, you should implement JWT or OAuth2 authentication.

## API Endpoints

### 1. Extracted Data

#### Get All Extracted Data

- **URL**: `/extracted-data`
- **Method**: `GET`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `search` (optional): Search term to filter results

**Example Request**:
```http
GET /api/extracted-data?page=1&limit=10&search=important
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b1b3b58f4c3d48a4b5c6",
      "title": "Important Document",
      "summary": "Summary of the extracted content...",
      "keyPoints": ["Point 1", "Point 2"],
      "date": "2023-07-20T12:00:00.000Z",
      "author": "John Doe",
      "originalText": "Full extracted text...",
      "metadata": {
        "model": "gemini-pro",
        "timestamp": "2023-07-20T12:05:30.000Z",
        "charactersProcessed": 1500
      },
      "createdAt": "2023-07-20T12:05:30.000Z",
      "updatedAt": "2023-07-20T12:05:30.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "pages": 1,
    "limit": 10
  }
}
```

#### Get Single Extracted Data

- **URL**: `/extracted-data/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id`: The ID of the extracted data to retrieve

**Example Request**:
```http
GET /api/extracted-data/60f7b1b3b58f4c3d48a4b5c6
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "60f7b1b3b58f4c3d48a4b5c6",
    "title": "Important Document",
    "summary": "Summary of the extracted content...",
    "keyPoints": ["Point 1", "Point 2"],
    "date": "2023-07-20T12:00:00.000Z",
    "author": "John Doe",
    "originalText": "Full extracted text...",
    "metadata": {
      "model": "gemini-pro",
      "timestamp": "2023-07-20T12:05:30.000Z",
      "charactersProcessed": 1500
    },
    "createdAt": "2023-07-20T12:05:30.000Z",
    "updatedAt": "2023-07-20T12:05:30.000Z"
  }
}
```

**Error Response (404 Not Found)**:
```json
{
  "success": false,
  "message": "Extracted data not found"
}
```

#### Create Extracted Data

- **URL**: `/extracted-data`
- **Method**: `POST`
- **Request Body**:
  - `title` (string, required): Title of the document
  - `summary` (string, required): Summary of the extracted content
  - `keyPoints` (array of strings, optional): Key points extracted from the document
  - `date` (string, optional): Date of the document (ISO 8601 format)
  - `author` (string, optional): Author of the document
  - `originalText` (string, required): The full extracted text
  - `metadata` (object, optional): Additional metadata

**Example Request**:
```http
POST /api/extracted-data
Content-Type: application/json

{
  "title": "Project Proposal",
  "summary": "This is a summary of the project proposal...",
  "keyPoints": ["Project goal", "Timeline", "Budget"],
  "date": "2023-08-15",
  "author": "Jane Smith",
  "originalText": "Full text content of the document...",
  "metadata": {
    "model": "gemini-pro",
    "charactersProcessed": 2500
  }
}
```

**Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "_id": "60f7b1b3b58f4c3d48a4b5c7",
    "title": "Project Proposal",
    "summary": "This is a summary of the project proposal...",
    "keyPoints": ["Project goal", "Timeline", "Budget"],
    "date": "2023-08-15T00:00:00.000Z",
    "author": "Jane Smith",
    "originalText": "Full text content of the document...",
    "metadata": {
      "model": "gemini-pro",
      "charactersProcessed": 2500,
      "timestamp": "2023-07-20T13:15:45.000Z"
    },
    "createdAt": "2023-07-20T13:15:45.000Z",
    "updatedAt": "2023-07-20T13:15:45.000Z"
  }
}
```

#### Update Extracted Data

- **URL**: `/extracted-data/:id`
- **Method**: `PUT`
- **URL Parameters**:
  - `id`: The ID of the extracted data to update
- **Request Body**: Same as create, but all fields are optional

**Example Request**:
```http
PUT /api/extracted-data/60f7b1b3b58f4c3d48a4b5c7
Content-Type: application/json

{
  "title": "Updated Project Proposal",
  "summary": "Updated summary..."
}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "60f7b1b3b58f4c3d48a4b5c7",
    "title": "Updated Project Proposal",
    "summary": "Updated summary...",
    "keyPoints": ["Project goal", "Timeline", "Budget"],
    "date": "2023-08-15T00:00:00.000Z",
    "author": "Jane Smith",
    "originalText": "Full text content of the document...",
    "metadata": {
      "model": "gemini-pro",
      "charactersProcessed": 2500,
      "timestamp": "2023-07-20T13:15:45.000Z"
    },
    "createdAt": "2023-07-20T13:15:45.000Z",
    "updatedAt": "2023-07-20T14:30:20.000Z"
  }
}
```

#### Delete Extracted Data

- **URL**: `/extracted-data/:id`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id`: The ID of the extracted data to delete

**Example Request**:
```http
DELETE /api/extracted-data/60f7b1b3b58f4c3d48a4b5c7
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Extracted data deleted successfully"
}
```

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message or validation errors"
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request (e.g., validation errors)
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Rate Limiting

The API implements rate limiting to prevent abuse. By default, clients are limited to 100 requests per 15-minute window. If exceeded, the API will respond with a 429 Too Many Requests status code.

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for the configured origins in the `CORS_ORIGIN` environment variable. By default, it's set to `http://localhost:3000` for development.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the server listens on | `5000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/pdf-editor` |
| `CORS_ORIGIN` | Allowed origins for CORS | `http://localhost:3000` |

## Deployment

For production deployment, make sure to:

1. Set `NODE_ENV=production`
2. Configure a production MongoDB instance
3. Set appropriate CORS origins
4. Enable HTTPS
5. Set up proper logging and monitoring
6. Implement authentication and authorization
