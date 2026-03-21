# 🚀 Admin Quick Start

## ⚡ One-Command Setup

To set up the admin user and access the dashboard:

```bash
npm run admin:create
```

This will create/update the admin user with these credentials:

## 🔐 Admin Login Credentials

```
┌─────────────────────────────────┐
│  Email:    raj@gmail.com        │
│  Password: 123                  │
└─────────────────────────────────┘
```

## 📍 Admin Dashboard URL

```
http://localhost:3000/admin-dashboard.html
```

## 🎯 Quick Steps to Access

1. **Start Server:**
   ```bash
   npm run dev
   ```

2. **Create Admin User:**
   ```bash
   npm run admin:create
   ```

3. **Open Dashboard:**
   - Go to: `http://localhost:3000/admin-dashboard.html`
   - Login with credentials above
   - Click login button

4. **Done!** You're now in the admin panel 🎉

## 📋 What's Available in Admin Panel?

✅ Dashboard - View real-time stats  
✅ Properties - Create, edit, delete, approve/reject  
✅ Users - Manage all registered users  
✅ Analytics - View reports and insights  
✅ Comments - Moderate user comments  
✅ Activity Logs - Track all admin actions  
✅ Settings - Configure system settings  
✅ Bulk Actions - Manage multiple properties at once  

## ⚠️ Important

- These are **development credentials**
- **Change them in production** by editing `db/create-admin.js`
- Database must be initialized first with `npm run db:init`

## 🆘 Need Help?

See `ADMIN_ACCESS.md` for detailed documentation and troubleshooting.

---

**Created:** March 2026  
**Status:** Ready to Use ✓
