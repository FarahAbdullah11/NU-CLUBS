# NU Clubs Portal - Setup Guide

Complete setup guide for the NU Clubs Portal project.

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Step 1: Database Setup

1. **Create the database:**
   ```bash
   mysql -u root -p
   ```
   Then run:
   ```sql
   source schema_review_and_amendments.sql
   ```

2. **Insert sample data:**
   ```sql
   source sample_data_insert.sql
   ```

## Step 2: Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MySQL credentials.

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3001`

## Step 3: Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## Step 4: Test the Application

1. Open `http://localhost:5173` in your browser
2. Login with one of the test credentials:
   - **NIMUN Leader**: `NU2021001` / any password
   - **RPM Leader**: `NU2021002` / any password
   - **ICPC Leader**: `NU2021003` / any password
   - **IEEE Leader**: `NU2021004` / any password

   ## Setup Passwords
- To auto-update: `node scripts/update-passwords.js`
- To generate SQL for manual run: `node scripts/generate-all-passwords.js`

## Project Structure

```
NU-CLUBS/
├── server/                 # Backend API
│   ├── config/            # Database configuration
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── src/                   # Frontend React app
│   ├── components/        # React components
│   ├── pages/             # Page components
│   └── App.tsx            # Main app component
├── schema_review_and_amendments.sql  # Database schema
└── sample_data_insert.sql            # Sample data
```

## Features Implemented

✅ Generalized Club Dashboard (works for any club)
✅ Backend API with Express.js
✅ MySQL database connection
✅ JWT authentication
✅ Club-specific data fetching
✅ Dashboard metrics (members, requests, events, budget)
✅ Notifications system

## Next Steps

- [ ] Implement password hashing with bcrypt
- [ ] Add request management endpoints
- [ ] Add event management endpoints
- [ ] Add funding request endpoints
- [ ] Implement file upload for funding documents
- [ ] Add calendar integration
- [ ] Add profile management

