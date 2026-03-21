# Database Migration and Enhancement Guide

## Overview

This document provides step-by-step instructions for implementing the database migration and new features (authentication, bookmarks, image uploads) for the Nepal Real Estate Web Application.

## Prerequisites

- Node.js 18.0.0 or higher
- PostgreSQL 12 or higher installed and running
- npm (Node Package Manager)
- Basic knowledge of PostgreSQL and Node.js

## Installation Steps

### 1. Install PostgreSQL

#### Windows:
1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation, set a password for the `postgres` user (remember this!)
4. Keep the default port as 5432
5. Complete the installation

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### 2. Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE nepal_real_estate;

# Create application user
CREATE USER nepal_user WITH PASSWORD 'secure_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nepal_real_estate TO nepal_user;

# Exit psql
\q
```

### 3. Update Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nepal_real_estate
DB_USER=nepal_user
DB_PASSWORD=secure_password_here
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
```

### 4. Install Dependencies

```bash
npm install
```

This installs the new packages:
- `pg` - PostgreSQL client
- `jsonwebtoken` - JWT token generation
- `bcryptjs` - Password hashing
- `dotenv` - Environment variable management
- `multer` - File upload handling

### 5. Initialize Database

```bash
# Run initialization script
node db/init.js
```

This script will:
- Create all database tables and indexes
- Create a default admin user
- Migrate existing JSON data to PostgreSQL

Output:
```
🔄 Initializing Nepal Real Estate Database...

📋 Creating database schema...
✓ Schema created successfully

👤 Creating default admin user...
✓ Admin user created: admin@nepalestate.com

📤 Migrating data from JSON file...
✓ Migrated 10 properties from JSON

✅ Database initialization complete!
```

### 6. Start the Application

```bash
npm run dev
```

The application will start with the following endpoints:

```
✓ Nepal Real Estate server running on http://localhost:3000
✓ API Documentation:
  - Legacy API: GET /api/properties
  - Database API: GET /api/properties-db
  - Authentication: POST /api/auth/register, POST /api/auth/login
  - Bookmarks: GET /api/bookmarks
  - Health: GET /api/health
```

## New API Endpoints

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "buyer"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "buyer"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Update User Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9801234567"
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

### Bookmarks Endpoints

#### Get User Bookmarks
```http
GET /api/bookmarks
Authorization: Bearer <token>
```

Response:
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
      "price": 8500000,
      "city": "Kathmandu",
      "bookmarked_at": "2026-03-18T10:30:00Z"
    }
  ]
}
```

#### Add Bookmark
```http
POST /api/bookmarks/1
Authorization: Bearer <token>
```

#### Remove Bookmark
```http
DELETE /api/bookmarks/1
Authorization: Bearer <token>
```

#### Check if Bookmarked
```http
GET /api/bookmarks/check/1
Authorization: Bearer <token>
```

### Database Properties Endpoints

#### List Properties (with filtering)
```http
GET /api/properties-db?type=apartment&status=sale&city=Kathmandu&minPrice=5000000&maxPrice=10000000
```

#### Create Property (with images)
```http
POST /api/properties-db
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- title: "Modern Apartment in Thamel"
- type: "apartment"
- status: "sale"
- price: "8500000"
- bedrooms: "2"
- bathrooms: "2"
- area: "850"
- areaUnit: "sqft"
- city: "Kathmandu"
- district: "Kathmandu"
- address: "Thamel, Kathmandu"
- description: "A beautifully designed..."
- contact: "9801234567"
- features: ["Parking", "Security", "Lift"] (JSON array)
- images: [file1, file2, file3] (up to 5 files)
```

#### Update Property
```http
PUT /api/properties-db/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Modern Apartment in Thamel (Updated)",
  "price": "8700000",
  "featured": true
}
```

#### Delete Property
```http
DELETE /api/properties-db/1
Authorization: Bearer <token>
```

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password_hash` - Hashed password (bcrypt)
- `first_name`, `last_name` - User names
- `phone` - Contact phone
- `role` - User role (buyer, seller, admin)
- `created_at`, `updated_at` - Timestamps

### Properties Table
- `id` - Primary key
- `seller_id` - Reference to users table
- `title`, `type`, `status` - Property information
- `price` - Listing price
- `bedrooms`, `bathrooms`, `area` - Physical details
- `city`, `district`, `address` - Location
- `description`, `contact` - Details and contact
- `featured` - Featured listing flag
- `view_count` - Number of views

### Supporting Tables
- `property_features` - Property amenities
- `property_images` - Property photos
- `user_bookmarks` - Saved properties
- `property_inquiries` - User inquiries
- `search_history` - Analytics

## File Structure

```
project/
├── config/
│   ├── auth.js              # JWT and auth configuration
│   └── database.js          # PostgreSQL connection pool
├── db/
│   ├── schema.sql           # Database schema
│   └── init.js              # Initialization script
├── middleware/
│   └── authMiddleware.js    # JWT verification middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── bookmarks.js         # Bookmark routes
│   ├── properties-db.js     # Database properties routes
│   └── properties.js        # Legacy JSON properties routes
├── uploads/
│   └── properties/          # Property image storage
├── .env                     # Environment variables
├── package.json
└── server.js                # Main application file
```

## Testing the New Features

### Test Authentication Flow

```bash
# 1. Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'

# 3. Get profile (use token from login response)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Bookmarks

```bash
# Add bookmark
curl -X POST http://localhost:3000/api/bookmarks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get bookmarks
curl -X GET http://localhost:3000/api/bookmarks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Remove bookmark
curl -X DELETE http://localhost:3000/api/bookmarks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

Solution:
- Verify PostgreSQL is running
- Check `.env` file has correct credentials
- Ensure database exists and is accessible

### JWT Token Errors
```
Error: Invalid token
```

Solution:
- Ensure token is included in Authorization header
- Use format: `Authorization: Bearer <token>`
- Check if token has expired

### File Upload Errors
```
Error: File too large
```

Solution:
- Default max file size is 5MB
- Change `MAX_FILE_SIZE` in `.env` file
- Ensure `uploads/properties` directory exists

## Security Considerations

1. **JWT Secret**: Change `JWT_SECRET` in `.env` file to a strong random string
2. **Password Policy**: Enforce strong passwords (minimum 6 characters required)
3. **CORS**: Configure `CORS_ORIGIN` for production environments
4. **Rate Limiting**: API has rate limiting (100 requests per 15 minutes)
5. **File Uploads**: Restrict file types and sizes
6. **Database**: Use SSL/TLS connections in production

## Performance Optimization

The database includes indexes on:
- `users.email` - Fast user lookups
- `properties.type, status, city, price` - Fast filtering
- `property_features.property_id` - Fast feature lookups
- `user_bookmarks.user_id, property_id` - Quick bookmark checks

## Rollback to JSON (if needed)

To revert to the original JSON-based system:

1. Comment out new routes in `server.js`
2. Keep using `/api/properties` endpoint
3. JSON data will continue to work unchanged

## Next Steps

1. **Update Frontend**: Modify HTML/JavaScript to use new authentication
2. **Add More Tests**: Expand test suite with new authentication tests
3. **Deploy**: Deploy to production with proper SSL/TLS configuration
4. **Monitor**: Set up monitoring and logging for production database

## Support

For issues or questions:
1. Check the API documentation in project report
2. Review database schema in `db/schema.sql`
3. Check application logs for error details
