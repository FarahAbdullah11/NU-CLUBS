# NU Clubs Backend Server

Backend API server for the NU Clubs Portal built with Express.js and MySQL.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ClubsData
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3001
NODE_ENV=development
```

### 3. Database Setup

Make sure you have:
1. Created the database using `schema_review_and_amendments.sql`
2. Inserted sample data using `sample_data_insert.sql`

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with university ID/email and password
- `GET /api/auth/me` - Get current user info (requires authentication)

### Clubs

- `GET /api/clubs/:clubId` - Get club details (requires authentication)
- `GET /api/clubs/:clubId/metrics` - Get club dashboard metrics (requires authentication)
- `GET /api/clubs` - Get all clubs (admin only)

### Notifications

- `GET /api/notifications` - Get user notifications (requires authentication)
- `PATCH /api/notifications/:notificationId/read` - Mark notification as read

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Test Login Credentials

Based on the sample data:

- **NIMUN Leader**: `NU2021001` / any password (for development)
- **RPM Leader**: `NU2021002` / any password
- **ICPC Leader**: `NU2021003` / any password
- **IEEE Leader**: `NU2021004` / any password
- **SU Admin**: `NU2020001` / any password
- **Student Life Admin**: `NU2020002` / any password

**Note**: In development mode, passwords starting with `$2b$10$example` are accepted. In production, implement proper bcrypt password verification.

