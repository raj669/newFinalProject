# Admin Access Guide

## Admin Credentials

Access the admin dashboard with the following default credentials:

```
Email:    raj@gmail.com
Password: 123
```

## How to Access the Admin Dashboard

### Step 1: Start the Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

### Step 2: Initialize Database & Create Admin User

If this is your first time setting up the application:

```bash
# Initialize the database schema and create admin user
npm run db:init
```

Or to create/update the admin user at any time:

```bash
npm run admin:create
```

### Step 3: Login as Admin

1. Open your browser and navigate to:
   ```
   http://localhost:3000/admin-dashboard.html
   ```

2. You will be redirected to the login page. Click **"Login"** in the navbar.

3. Enter the credentials:
   - **Email:** `raj@gmail.com`
   - **Password:** `123`

4. Click **"Login"** button.

5. You will be redirected to the admin dashboard!

## Admin Dashboard Features

Once logged in as admin, you have access to:

### 📊 Dashboard
- Real-time statistics (total properties, pending approvals, users, comments)
- Recent activity feed
- Key metrics overview

### 🏠 Properties Management
- View all properties
- Search and filter by type, status, approval
- Create new properties
- Edit properties
- Delete properties (single or bulk)
- Approve/reject pending properties

### 👥 Users Management
- View all registered users
- Filter by role (Buyer/Seller/Admin)
- Search users
- Reset user passwords
- Delete user accounts

### 📈 Analytics & Reports
- Properties by type (chart)
- Properties by status (Sale vs Rent)
- Properties by approval status
- Top 10 cities with most listings
- Key metrics: Average price, most common type, top city, approval rate

### ⏳ Pending Approvals
- Review properties awaiting approval
- Leave approval comments
- Approve or reject with reasons

### 💬 Comments Review
- Review pending user comments
- Approve comments for display

### 📋 Activity Logs
- Complete audit trail of all admin actions
- Filter by action type (create, update, delete, approve, etc.)
- Timestamp and admin tracking

### ⚙️ Settings
- **System Configuration:**
  - Maintenance mode toggle
  - Auto-approve properties toggle
  - Email notifications toggle
  
- **Data Management:**
  - Export all properties as CSV
  - Clear activity logs
  
- **Property Limits:**
  - Set max properties per user
  - Require approval setting
  
- **System Info:**
  - View storage usage
  - Last backup timestamp
  - Backup database button

## Changing Admin Password

To change the admin password:

1. Update the password in `db/create-admin.js`:
   ```javascript
   const adminPassword = 'your_new_password'; // Change this
   ```

2. Run the script:
   ```bash
   npm run admin:create
   ```

## Important Notes

⚠️ **Security Warning:**
- The default credentials `raj@gmail.com / 123` are for **development/testing only**
- **Change the password immediately in production** by updating `db/create-admin.js`
- Always keep your JWT secret key safe in `.env`
- Enable HTTPS in production
- Implement rate limiting on login endpoint

## Troubleshooting

### Admin Login Not Working
1. Verify the server is running: `npm run dev`
2. Check database connection in `.env`
3. Recreate admin user: `npm run admin:create`
4. Check browser console for errors (F12)

### Can't Find Admin Dashboard
- Ensure you're accessing: `http://localhost:3000/admin-dashboard.html`
- If redirected to index.html, your login credentials are incorrect
- Check that your JWT token is saved in browser localStorage

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Run: `npm run db:init` to initialize database

## API Endpoints Used

Admin operations use these endpoints (all require admin role & JWT token):

```
GET    /api/admin/properties              - List all properties
POST   /api/admin/properties              - Create property
PUT    /api/admin/properties/:id          - Update property
DELETE /api/admin/properties/:id          - Delete property
POST   /api/admin/properties/:id/approve  - Approve property
POST   /api/admin/properties/:id/reject   - Reject property
GET    /api/admin/users                   - List all users
DELETE /api/admin/users/:id               - Delete user
GET    /api/comments/admin/pending        - List pending comments
POST   /api/comments/:id/approve          - Approve comment
GET    /api/admin/logs                    - Activity logs
DELETE /api/admin/logs                    - Clear logs
```

## Session Management

- Login sessions are stored in browser `localStorage`
- Token expires after the time set in `.env` (default: 7 days)
- Logout clears the session and returns to home page
- Each admin action is logged for audit purposes

---

**Last Updated:** March 2026  
**Version:** 1.0.0
