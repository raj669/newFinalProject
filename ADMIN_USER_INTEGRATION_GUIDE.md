# Admin & User Integration Guide

This document outlines the changes made to integrate admin and user roles with Firebase support.

## 📋 Overview

Your project now includes:
- **User Side**: Browse approved properties, view details, add comments/reviews
- **Admin Side**: Manage properties (Create, Read, Update, Delete), approve/reject submissions, moderate comments
- **Firebase Integration**: Ready for cloud storage and authentication
- **Property Approval System**: Admin must approve properties before they're visible to users
- **Comments System**: Users can leave reviews on properties

## 🔑 Key Features

### User Features
- ✅ View all approved properties
- ✅ Filter by type, status, city, price
- ✅ View detailed property information
- ✅ Add comments and ratings to properties
- ✅ Bookmark/Save favorite properties
- ✅ See comments from other users

### Admin Features
- ✅ Manage all properties (CRUD operations)
- ✅ Review pending property submissions
- ✅ Approve or reject properties with comments
- ✅ View all properties with approval status
- ✅ Moderate user comments before they're visible
- ✅ Create new properties directly

## 📁 New Files Created

### Backend Routes
- **`routes/admin.js`** - Admin property management endpoints
- **`routes/comments.js`** - Comment management endpoints
- **`config/firebase.js`** - Firebase configuration and initialization

### Frontend Pages
- **`public/user-dashboard.html`** - User properties browsing page
- **`public/admin-dashboard.html`** - Admin management dashboard

### Database
- **`db/schema.sql`** - Updated with new tables for approval and comments

### Configuration
- **`.env.template`** - Environment variables template for Firebase and other configs

## 🔧 Database Changes

### New Tables

#### `property_verifications`
Tracks property approval status
```sql
CREATE TABLE property_verifications (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  verified_by INTEGER,
  verification_status VARCHAR(50) DEFAULT 'pending',
  verification_date TIMESTAMP,
  rejection_reason TEXT,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `property_comments`
Stores user comments and reviews
```sql
CREATE TABLE property_comments (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  comment_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Modified Tables

#### `properties`
- Added `approval_status` column (pending, approved, rejected)

## 🛣️ API Endpoints

### Admin Routes (`/api/admin`)

#### Property Management
```
GET    /api/admin/properties                    - Get all properties with filtering
GET    /api/admin/properties/:id               - Get single property details
POST   /api/admin/properties                   - Create new property
PUT    /api/admin/properties/:id               - Update property
DELETE /api/admin/properties/:id               - Delete property
POST   /api/admin/properties/:id/approve       - Approve a property
POST   /api/admin/properties/:id/reject        - Reject a property
```

**Required Headers**: `Authorization: Bearer <token>`
**Admin Role**: Required for all endpoints

### Comments Routes (`/api/comments`)

```
GET    /api/comments/property/:propertyId      - Get comments for a property
POST   /api/comments                           - Create a comment
GET    /api/comments/:id                       - Get single comment
PUT    /api/comments/:id                       - Update comment (author/admin only)
DELETE /api/comments/:id                       - Delete comment (author/admin only)
GET    /api/comments/admin/pending             - Get pending comments (admin only)
POST   /api/comments/:id/approve               - Approve a comment (admin only)
```

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Update your PostgreSQL database with new tables:
```bash
npm run db:init
# Or manually run: psql -U postgres -d nepal_real_estate -f db/schema.sql
```

### 3. Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Note your Project ID

2. **Get Service Account Credentials**
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Copy the JSON content

3. **Configure Environment Variables**
   - Copy `.env.template` to `.env`
   - Replace placeholders:
     - `FIREBASE_SERVICE_ACCOUNT`: Paste the service account JSON (keep as one-line string)
     - `FIREBASE_DATABASE_URL`: Your Firebase Realtime Database URL
     - `FIREBASE_STORAGE_BUCKET`: Your Firebase Storage bucket

4. **Example `.env` (partial)**
   ```
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"my-app",...}
   FIREBASE_DATABASE_URL=https://my-app.firebaseio.com
   FIREBASE_STORAGE_BUCKET=my-app.appspot.com
   ```

### 4. User Registration with Roles
Users can register with a role:
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "buyer"  // or "seller", "admin"
}
```

## 📊 Property Approval Workflow

1. **User/Seller Posts Property**
   - Initial status: `pending`

2. **Admin Reviews**
   - Navigate to "Pending Approval" tab
   - Review property details
   - Click "Approve" or "Reject"

3. **User Sees Property**
   - Only `approved` properties show on user dashboard
   - Users can comment on approved properties

4. **Admin Moderates Comments**
   - New comments default to `is_approved = true`
   - Admins can view and manage comments in Comments tab

## 🔐 Authentication & Authorization

### Roles
- **buyer**: Can browse properties, add comments, bookmark
- **seller**: Can post properties, view own listings
- **admin**: Can manage all properties, approve/reject, moderate comments

### JWT Token
All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

Token claims include:
- `id`: User ID
- `email`: User email
- `role`: User role

## 🌐 Access Dashboards

### User Dashboard
```
http://localhost:3000/user-dashboard.html
```

### Admin Dashboard
```
http://localhost:3000/admin-dashboard.html
```

## 📝 Firebase Integration

The Firebase integration is prepared for:
- Cloud storage for property images
- Realtime database for notifications
- Authentication (optional, currently using JWT)
- Cloud Functions for advanced workflows

**Note**: Firebase is optional. The system works with PostgreSQL alone.

## 🔄 Migration from Old System

If you had existing JSON-based properties:
1. The system still supports the old `/api/properties` endpoint
2. Database endpoint is `/api/properties-db`
3. Run database init to migrate data if needed

## 🐛 Troubleshooting

### "Firebase features will be disabled"
- Check `.env` file has `FIREBASE_SERVICE_ACCOUNT` set
- Ensure the JSON is properly escaped if it's a string

### "Admin privileges required"
- User role must be 'admin'
- Create admin user: Register with `"role": "admin"`

### Comments not appearing
- Comments default to approved (`is_approved = true`)
- Check admin comments tab to moderate if needed

### Properties not showing
- Check property `approval_status = 'approved'`
- Admin must approve properties first

## 📚 Additional Resources

- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/)

## 🎯 Next Steps

1. ✅ Set up Firebase
2. ✅ Run database migrations
3. ✅ Create admin user account
4. ✅ Test admin dashboard
5. ✅ Create test properties
6. ✅ Test approval workflow
7. ✅ Test user commenting

## 📞 Support

For issues or questions:
- Check error logs in browser console
- Review server console output
- Verify database connection
- Ensure all environment variables are set
