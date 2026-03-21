# Nepal Real Estate Web Application - Enhanced Edition

A full-stack real estate property listing web application with PostgreSQL database, user authentication, image uploads, and bookmark systems.

## 🚀 Features

### Version 2.0 (Current)
- ✅ PostgreSQL database integration
- ✅ User registration and authentication (JWT)
- ✅ Bookmark/save favorite properties
- ✅ Image upload for properties (up to 5 images)
- ✅ User profiles and password management
- ✅ Advanced property filtering and search
- ✅ Property analytics (view counting)
- ✅ Rate limiting and security
- ✅ RESTful API architecture
- ✅ Responsive web interface

### Backward Compatibility
- ✅ Legacy JSON API still available
- ✅ Seamless migration from JSON to database
- ✅ Coexisting dual-API architecture

## 📋 System Requirements

- **Node.js**: 18.0.0 or higher
- **PostgreSQL**: 12 or higher
- **npm**: 8.0.0 or higher
- **RAM**: 512MB minimum
- **Storage**: 1GB for application + database

## 🔧 Quick Start

### 1. Clone and Install

```bash
cd My_project
npm install
```

### 2. Automated Setup (Recommended)

```bash
npm run setup
```

This will:
- Copy `.env.example` to `.env`
- Prompt for database configuration
- Create upload directories
- Guide you through database setup

### 3. Manual Setup (Alternative)

#### Create `.env` file:
```bash
cp .env.example .env
```

#### Edit `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nepal_real_estate
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

#### Set up PostgreSQL:

```bash
# For Windows (using psql)
psql -U postgres

# For macOS/Linux
sudo -u postgres psql
```

```sql
CREATE DATABASE nepal_real_estate;
CREATE USER nepal_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nepal_real_estate TO nepal_user;
\q
```

#### Initialize Database:

```bash
npm run db:init
```

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run at: **http://localhost:3000**

## 📚 Documentation

### Main Documents:
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference with examples
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Detailed setup and migration instructions
- **[PROJECT_REPORT.md](PROJECT_REPORT.md)** - Comprehensive project report with design documents

### Quick References:
- **Database Schema**: [db/schema.sql](db/schema.sql)
- **.env Configuration**: [.env.example](.env.example)

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/profile           - Get user profile
PUT    /api/auth/profile           - Update profile
POST   /api/auth/change-password   - Change password
```

### Properties (Database)
```
GET    /api/properties-db          - List all properties
GET    /api/properties-db/:id      - Get property details
POST   /api/properties-db          - Create property (requires auth)
PUT    /api/properties-db/:id      - Update property (requires auth)
DELETE /api/properties-db/:id      - Delete property (requires auth)
GET    /api/properties-db/featured - Get featured properties
```

### Properties (Legacy JSON)
```
GET    /api/properties             - List all properties
GET    /api/properties/:id         - Get property details
GET    /api/properties/featured    - Get featured properties
```

### Bookmarks
```
GET    /api/bookmarks              - Get user's bookmarks
POST   /api/bookmarks/:id          - Bookmark property
DELETE /api/bookmarks/:id          - Remove bookmark
GET    /api/bookmarks/check/:id    - Check if bookmarked
```

### Health
```
GET    /api/health                 - Server health check
```

## 📂 Project Structure

```
nepal-real-estate/
├── config/
│   ├── auth.js                 # JWT and auth configuration
│   └── database.js             # PostgreSQL connection pool
├── db/
│   ├── schema.sql              # Database schema
│   └── init.js                 # Database initialization
├── middleware/
│   └── authMiddleware.js       # JWT verification
├── routes/
│   ├── auth.js                 # Authentication routes
│   ├── bookmarks.js            # Bookmark routes
│   ├── properties-db.js        # Database properties API
│   └── properties.js           # Legacy properties API
├── public/                     # Frontend files
│   ├── index.html
│   ├── property.html
│   ├── properties.html
│   ├── contact.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
├── uploads/                    # Property images storage
│   └── properties/
├── tests/
│   └── api.test.js
├── .env.example               # Environment template
├── .env                       # Environment variables (create from example)
├── API_DOCUMENTATION.md       # API reference
├── MIGRATION_GUIDE.md         # Setup guide
├── PROJECT_REPORT.md          # Project report
├── README.md                  # This file
├── server.js                  # Main server file
├── package.json
└── setup.js                   # Setup automation script
```

## 🔐 Authentication

### Registration Example:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Using Token:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/auth/profile
```

## 🖼️ Image Upload

Upload property images with property creation:

```bash
curl -X POST http://localhost:3000/api/properties-db \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Modern Apartment" \
  -F "type=apartment" \
  -F "status=sale" \
  -F "price=8500000" \
  -F "area=850" \
  -F "city=Kathmandu" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

**Image Requirements:**
- Max 5 files per property
- Max 5MB per file
- Supported: JPEG, PNG, GIF, WebP
- Files stored in: `uploads/properties/`

## 🧪 Testing

### Run Tests:
```bash
npm test
```

### Test Coverage:
- API endpoint functionality
- Filter operations
- Data validation
- Error handling

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable cross-origin access
- **File Upload Validation**: Type and size restrictions
- **Input Validation**: Server-side parameter validation
- **SQL Injection Prevention**: Parameterized queries

## 📊 Database Features

- **Indexes**: Optimized for fast queries on frequently filtered columns
- **Relationships**: Users → Properties → Features/Images
- **Constraints**: Unique emails, foreign keys, cascading deletes
- **JSON Support**: Array fields for features and images
- **View Counting**: Automatic analytics

## ⚙️ Configuration

### Environment Variables (.env):

```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nepal_real_estate
DB_USER=nepal_user
DB_PASSWORD=your_password

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# File Uploads
MAX_FILE_SIZE=5242880        # 5MB in bytes
UPLOAD_DIR=uploads

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Production Deployment

### Recommendations:
1. Use strong `JWT_SECRET`
2. Set `NODE_ENV=production`
3. Enable HTTPS/SSL
4. Use environment-specific `.env` files
5. Configure production database credentials
6. Set up database backups
7. Use CDN for image files
8. Enable monitoring and logging

### Example Production Setup:
```bash
NODE_ENV=production npm start
```

## 🐛 Troubleshooting

### Database Connection Error
```
Solution: Ensure PostgreSQL is running and credentials are correct
```

### PORT Already in Use
```bash
# Change PORT in .env or run on different port:
PORT=3001 npm start
```

### File Upload Issues
```
Solution: Ensure uploads/properties directory exists with write permissions
```

### JWT Token Expired
```
Solution: Re-login to get a fresh token
```

## 📝 Common Tasks

### Create Admin User:
```sql
INSERT INTO users (email, password_hash, role, is_verified)
VALUES ('admin@example.com', '$2a$10$...', 'admin', true);
```

### Reset Database:
```bash
psql -U postgres -d nepal_real_estate -f db/schema.sql
npm run db:init
```

### View Database:
```bash
psql -U nepal_user -d nepal_real_estate
\dt                    -- List tables
\d properties         -- Describe properties table
SELECT * FROM properties LIMIT 5;  -- Query properties
```

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/)
- [Node.js Guide](https://nodejs.org/en/docs/)

## 📞 Support

### If you encounter issues:

1. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for endpoint errors
2. Review [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for setup issues
3. Verify database credentials in `.env`
4. Check application logs in terminal
5. Review error messages for specific guidance

## 📈 Roadmap

### Short-term (1-3 months):
- [ ] Mobile app development
- [ ] Advanced search/filtering UI
- [ ] Email notifications
- [ ] Property comparisons

### Medium-term (3-6 months):
- [ ] Payment gateway integration
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] SMS notifications

### Long-term (6-12 months):
- [ ] Machine learning recommendations
- [ ] Virtual property tours
- [ ] Augmented reality features
- [ ] Market analysis tools

## 📄 License

MIT License - See LICENSE file for details

## 👥 Authors

Nepal Real Estate Development Team

## 🎉 Changelog

### Version 2.0 (Current)
- PostgreSQL database integration
- JWT authentication system
- User profiles and bookmarks
- Image upload capability
- Enhanced filtering and search
- API documentation

### Version 1.0
- Initial JSON-based implementation
- Basic property listing
- Search functionality
- Rate limiting

---

**Last Updated**: March 18, 2026
**Application Version**: 2.0.0
**Status**: Production Ready

For detailed information, see [PROJECT_REPORT.md](PROJECT_REPORT.md)
