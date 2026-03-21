# Nepal Real Estate Web Application - API Documentation

## Overview

This document provides comprehensive documentation for all API endpoints available in the Nepal Real Estate Web Application. The API supports both legacy JSON-based properties and new database-backed functionality including authentication, bookmarks, and advanced property management.

**Base URL**: `http://localhost:3000/api`

**Authentication**: JWT Bearer Token in Authorization header

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Properties Endpoints](#properties-endpoints)
3. [Bookmarks Endpoints](#bookmarks-endpoints)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Data Types](#data-types)

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "buyer"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | Unique email address (will be lowercased) |
| password | string | Yes | Minimum 6 characters |
| firstName | string | No | User's first name |
| lastName | string | No | User's last name |
| role | string | No | User role: `buyer`, `seller`, `admin` (default: `buyer`) |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6ImJ1eWVyIiwiaWF0IjoxNjc2NDIwMDA4LCJleHAiOjE2NzcwMjQwMDh9.7V5Z...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "buyer"
  }
}
```

**Error Responses:**

| Status | Error Message |
|--------|---------------|
| 400 | Email and password are required |
| 400 | Password must be at least 6 characters |
| 409 | Email already registered |
| 500 | Registration failed |

---

### POST /auth/login

Authenticate user and receive JWT token.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | Registered email address |
| password | string | Yes | User password |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

**Error Responses:**

| Status | Error Message |
|--------|---------------|
| 400 | Email and password are required |
| 401 | Invalid email or password |
| 500 | Login failed |

---

### GET /auth/profile

Get current authenticated user's profile.

**Request:**
```http
GET /api/auth/profile
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "9801234567",
    "role": "buyer",
    "profileImage": null,
    "isVerified": false,
    "createdAt": "2026-03-18T10:30:00Z"
  }
}
```

**Requirements:**
- Valid JWT token in Authorization header

**Error Responses:**

| Status | Error Message |
|--------|---------------|
| 401 | No authorization token provided |
| 401 | Invalid authorization header format. Use: Bearer <token> |
| 404 | User not found |
| 500 | Failed to fetch profile |

---

### PUT /auth/profile

Update current user's profile information.

**Request:**
```http
PUT /api/auth/profile
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9801234567"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| firstName | string | No | Updated first name |
| lastName | string | No | Updated last name |
| phone | string | No | Contact phone number |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "9801234567",
    "role": "buyer"
  }
}
```

**Error Responses:**

| Status | Error Message |
|--------|---------------|
| 401 | User not authenticated |
| 404 | User not found |
| 500 | Failed to update profile |

---

### POST /auth/change-password

Change user password.

**Request:**
```http
POST /api/auth/change-password
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| currentPassword | string | Yes | Current password for verification |
| newPassword | string | Yes | New password (min 6 characters) |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**

| Status | Error Message |
|--------|---------------|
| 400 | Current password and new password are required |
| 400 | New password must be at least 6 characters |
| 401 | Current password is incorrect |
| 500 | Failed to change password |

---

## Properties Endpoints

### GET /properties (Legacy JSON API)

Retrieve properties from legacy JSON data source.

**Request:**
```http
GET /api/properties?type=apartment&status=sale&city=Kathmandu&minPrice=5000000&maxPrice=10000000&bedrooms=2&featured=true
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by type: `apartment`, `house`, `villa`, `commercial`, `land` |
| status | string | Filter by status: `sale`, `rent` |
| city | string | Filter by city (case-insensitive partial match) |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |
| bedrooms | number | Minimum bedroom count |
| featured | boolean | Include only featured properties (true/false) |

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "Modern Apartment in Thamel",
      "type": "apartment",
      "status": "sale",
      "price": 8500000,
      "bedrooms": 2,
      "bathrooms": 2,
      "area": 850,
      "areaUnit": "sqft",
      "city": "Kathmandu",
      "district": "Kathmandu",
      "address": "Thamel, Kathmandu",
      "description": "A beautifully designed modern apartment...",
      "features": ["Parking", "Security", "Water Supply", "Backup Power", "Lift"],
      "images": ["apartment1.jpg"],
      "contact": "9801234567",
      "listedDate": "2024-01-15",
      "featured": true
    }
  ]
}
```

**No authentication required**

---

### GET /properties/:id (Legacy JSON API)

Retrieve details of a specific property.

**Request:**
```http
GET /api/properties/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Modern Apartment in Thamel",
    "type": "apartment",
    "status": "sale",
    "price": 8500000,
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 850,
    "areaUnit": "sqft",
    "city": "Kathmandu",
    "district": "Kathmandu",
    "address": "Thamel, Kathmandu",
    "description": "A beautifully designed modern apartment...",
    "features": ["Parking", "Security", "Water Supply", "Backup Power", "Lift"],
    "images": ["apartment1.jpg"],
    "contact": "9801234567",
    "listedDate": "2024-01-15",
    "featured": true
  }
}
```

**Error Responses:**

| Status | Error Message |
|--------|---------------|
| 400 | Invalid property ID |
| 404 | Property not found |

---

### GET /properties/featured (Legacy JSON API)

Retrieve featured properties only.

**Request:**
```http
GET /api/properties/featured
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "Modern Apartment in Thamel",
      ...
    }
  ]
}
```

---

### GET /properties-db

Retrieve properties from PostgreSQL database with advanced filtering.

**Request:**
```http
GET /api/properties-db?type=apartment&status=sale&city=Kathmandu&minPrice=5000000
```

**Query Parameters:**
Same as legacy API with enhanced filtering capabilities.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "title": "Modern Apartment in Thamel",
      "type": "apartment",
      "status": "sale",
      "price": "8500000.00",
      "bedrooms": 2,
      "bathrooms": 2,
      "area": "850.00",
      "area_unit": "sqft",
      "city": "Kathmandu",
      "district": "Kathmandu",
      "address": "Thamel, Kathmandu",
      "description": "A beautifully designed...",
      "featured": true,
      "view_count": 145,
      "primary_image": "/uploads/properties/property-1.jpg",
      "features": ["Parking", "Security", "Lift"]
    }
  ]
}
```

---

### GET /properties-db/:id

Retrieve detailed information for a specific property with images and features.

**Request:**
```http
GET /api/properties-db/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Modern Apartment in Thamel",
    "type": "apartment",
    "status": "sale",
    "price": "8500000.00",
    "bedrooms": 2,
    "bathrooms": 2,
    "area": "850.00",
    "city": "Kathmandu",
    "address": "Thamel, Kathmandu",
    "description": "A beautifully designed...",
    "featured": true,
    "view_count": 146,
    "first_name": "John",
    "last_name": "Seller",
    "phone": "9801234567",
    "images": [
      {
        "id": 1,
        "url": "/uploads/properties/property-1.jpg",
        "isPrimary": true
      },
      {
        "id": 2,
        "url": "/uploads/properties/property-2.jpg",
        "isPrimary": false
      }
    ],
    "features": ["Parking", "Security", "Lift", "Water Supply"]
  }
}
```

---

### GET /properties-db/featured

Retrieve top 12 featured properties from database.

**Request:**
```http
GET /api/properties-db/featured
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

---

### POST /properties-db

Create a new property listing with images (requires authentication).

**Request:**
```http
POST /api/properties-db
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

Form Data:
{
  "title": "Modern Apartment in Thamel",
  "type": "apartment",
  "status": "sale",
  "price": 8500000,
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 850,
  "areaUnit": "sqft",
  "city": "Kathmandu",
  "district": "Kathmandu",
  "address": "Thamel, Kathmandu",
  "description": "A beautifully designed modern apartment...",
  "contact": "9801234567",
  "features": ["Parking", "Security", "Lift"],
  "images": [file1, file2, file3]
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | Yes | Property title |
| type | string | Yes | Property type |
| status | string | Yes | Status (sale/rent) |
| price | number | Yes | Price in NPR |
| bedrooms | number | No | Number of bedrooms |
| bathrooms | number | No | Number of bathrooms |
| area | number | Yes | Property area |
| areaUnit | string | No | Area unit (sqft/sqm, default: sqft) |
| city | string | Yes | City name |
| district | string | No | District name |
| address | string | No | Full address |
| description | string | No | Property description |
| contact | string | No | Contact phone |
| features | array | No | Array of amenities |
| images | file[] | No | Up to 5 images (max 5MB each) |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Property created successfully",
  "propertyId": 15
}
```

**Requirements:**
- Valid JWT token
- User must be seller or admin

**Error Responses:**

| Status | Error Message |
|--------|---------------|
| 400 | Missing required fields |
| 401 | No authorization token provided |
| 413 | File too large |
| 415 | Invalid file type |
| 500 | Failed to create property |

---

### PUT /properties-db/:id

Update property information (requires ownership or admin).

**Request:**
```http
PUT /api/properties-db/1
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Updated Apartment Title",
  "price": 8700000,
  "featured": true,
  "description": "Updated description..."
}
```

**Parameters:**
All property fields are optional - only include fields to update.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Property updated successfully",
  "propertyId": 1
}
```

**Requirements:**
- Valid JWT token
- Must be property owner or admin

**Error Responses:**

| Status | Error Message |
|--------|---------------|
| 400 | Invalid property ID |
| 401 | User not authenticated |
| 403 | You do not have permission to update this property |
| 404 | Property not found |
| 500 | Failed to update property |

---

### DELETE /properties-db/:id

Delete a property listing (requires ownership or admin).

**Request:**
```http
DELETE /api/properties-db/1
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

**Requirements:**
- Valid JWT token
- Must be property owner or admin

**Error Responses:**

| Status | Error Message |
|--------|---------------|
| 400 | Invalid property ID |
| 401 | User not authenticated |
| 403 | You do not have permission to delete this property |
| 404 | Property not found |
| 500 | Failed to delete property |

---

## Bookmarks Endpoints

### GET /bookmarks

Retrieve all bookmarked properties for authenticated user.

**Request:**
```http
GET /api/bookmarks
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Modern Apartment in Thamel",
      "type": "apartment",
      "status": "sale",
      "price": "8500000.00",
      "bedrooms": 2,
      "bathrooms": 2,
      "area": "850.00",
      "area_unit": "sqft",
      "city": "Kathmandu",
      "address": "Thamel, Kathmandu",
      "featured": true,
      "primary_image": "/uploads/properties/property-1.jpg",
      "bookmarked_at": "2026-03-18T10:30:00Z"
    }
  ]
}
```

**Requirements:**
- Valid JWT token

---

### POST /bookmarks/:propertyId

Add a property to user's bookmarks.

**Request:**
```http
POST /api/bookmarks/1
Authorization: Bearer <JWT_TOKEN>
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Property bookmarked successfully",
  "bookmark": {
    "id": 10,
    "created_at": "2026-03-18T10:35:00Z"
  }
}
```

**Error Responses:**

| Status | Error Message |
|--------|---------------|
| 400 | Invalid property ID |
| 401 | No authorization token provided |
| 404 | Property not found |
| 409 | Property already bookmarked |
| 500 | Failed to bookmark property |

---

### DELETE /bookmarks/:propertyId

Remove a property from user's bookmarks.

**Request:**
```http
DELETE /api/bookmarks/1
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bookmark removed successfully"
}
```

**Error Responses:**

| Status | Error Message |
|--------|---------------|
| 400 | Invalid property ID |
| 401 | No authorization token provided |
| 404 | Bookmark not found |
| 500 | Failed to remove bookmark |

---

### GET /bookmarks/check/:propertyId

Check if a property is bookmarked by the user.

**Request:**
```http
GET /api/bookmarks/check/1
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "isBookmarked": true
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Descriptive error message",
  "error": "Detailed error information (in development)"
}
```

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource successfully created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 413 | Payload Too Large - File too large |
| 415 | Unsupported Media Type - Invalid file type |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`
- **Response**: 429 Too Many Requests when exceeded

```
RateLimit-Limit: 100
RateLimit-Remaining: 45
RateLimit-Reset: 1710768900
```

---

## Data Types

### User Object

```json
{
  "id": 1,
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9801234567",
  "role": "buyer",
  "profileImage": null,
  "isVerified": false,
  "createdAt": "2026-03-18T10:30:00Z"
}
```

### Property Object (Database)

```json
{
  "id": 1,
  "title": "Modern Apartment in Thamel",
  "type": "apartment",
  "status": "sale",
  "price": "8500000.00",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": "850.00",
  "area_unit": "sqft",
  "city": "Kathmandu",
  "district": "Kathmandu",
  "address": "Thamel, Kathmandu",
  "description": "A beautifully designed...",
  "contact": "9801234567",
  "featured": true,
  "view_count": 145,
  "seller_name": "John Seller",
  "images": [...],
  "features": [...]
}
```

### Enum Values

**Property Types:**
- `apartment`
- `house`
- `villa`
- `commercial`
- `land`

**Property Status:**
- `sale`
- `rent`

**User Roles:**
- `buyer`
- `seller`
- `admin`

---

## Authentication

### JWT Token Structure

Tokens are JWT (JSON Web Tokens) with the following payload:

```json
{
  "id": 1,
  "email": "john@example.com",
  "role": "buyer",
  "iat": 1676420008,
  "exp": 1677024008
}
```

### Using Tokens

Include token in all authenticated requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

- Default expiration: 7 days
- Configurable via `JWT_EXPIRE` environment variable

---

## Code Examples

### JavaScript/Fetch

```javascript
// Register user
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John'
  })
});

const { token } = await registerResponse.json();

// Get user profile with token
const profileResponse = await fetch('/api/auth/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const profile = await profileResponse.json();
```

### curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Get profile with token
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/auth/profile
```

---

## Changelog

### Version 2.0 (Database + Authentication)
- Added PostgreSQL database support
- Implemented JWT authentication
- Added user profiles and bookmarks
- Image upload support
- Property analytics (view counts)
- Inquiry tracking system

### Version 1.0 (Initial)
- JSON-based property listings
- Basic filtering and search
- Rate limiting

---

**Last Updated**: March 18, 2026
**API Version**: 2.0
