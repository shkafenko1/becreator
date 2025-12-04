# BeCreator - Online Course Platform

A full-stack online course management platform built with Angular and Node.js/Express.

## Features

### Admin Features
- Course management (create/edit modules and lessons)
- Site customization (colors, logos, branding)
- Student management and progress tracking
- Authentication and authorization

### Student Features
- Course structure viewing
- Lesson viewing with video player
- Progress tracking
- Mark lessons as completed

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Swagger API Documentation

### Frontend
- Angular 20
- TypeScript
- SCSS

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already created with default values. If you need to customize:
```env
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://yahor:password123@localhost:5432/becreator
JWT_SECRET=becreator-secret-key-change-in-production-2024
CLIENT_URL=http://localhost:4200
ADMIN_EMAIL=admin@becreator.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User
```

4. Set up the database (requires sudo):
```bash
# Option 1: Use the automated script (will prompt for password)
cd ..
./setup-db.sh

# Option 2: Manual setup (see DATABASE_SETUP.md for details)
sudo -u postgres psql << 'EOSQL'
CREATE USER yahor WITH PASSWORD 'password123';
ALTER USER yahor CREATEDB;
CREATE DATABASE becreator OWNER yahor;
\q
EOSQL

cd server
export PGPASSWORD=password123
psql -U yahor -d becreator -f migrations/001_initial_schema.sql
npm run seed
```

5. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:8000`
API documentation (Swagger) at `http://localhost:8000/api-docs`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Admin Routes (require admin auth)
- `GET /api/admin/course` - Get course info
- `PUT /api/admin/course` - Update course
- `GET /api/admin/modules` - Get all modules
- `POST /api/admin/modules` - Create module
- `PUT /api/admin/modules/:id` - Update module
- `DELETE /api/admin/modules/:id` - Delete module
- `GET /api/admin/modules/:moduleId/lessons` - Get lessons
- `POST /api/admin/modules/:moduleId/lessons` - Create lesson
- `PUT /api/admin/lessons/:id` - Update lesson
- `DELETE /api/admin/lessons/:id` - Delete lesson
- `GET /api/admin/site-settings` - Get site settings
- `PUT /api/admin/site-settings` - Update site settings
- `GET /api/admin/students` - Get students list
- `POST /api/admin/students/enroll` - Enroll student

### Student Routes (require student auth)
- `GET /api/student/course` - Get course structure
- `GET /api/student/lessons/:id` - Get lesson details
- `POST /api/student/lessons/:id/complete` - Mark lesson complete
- `POST /api/student/lessons/:id/incomplete` - Mark lesson incomplete
- `GET /api/student/progress` - Get progress

## Project Structure

```
├── server/
│   ├── migrations/          # Database migrations
│   ├── scripts/             # Utility scripts (seed, etc.)
│   └── src/
│       ├── config/          # Configuration files
│       ├── controllers/     # Request handlers
│       ├── middleware/      # Express middleware
│       ├── models/          # Database models
│       ├── routes/          # API routes
│       ├── app.js           # Express app setup
│       └── server.js        # Server entry point
├── client/
│   └── src/
│       └── app/
│           ├── components/  # Angular components
│           ├── guards/      # Route guards
│           ├── pages/       # Page components
│           ├── services/    # API services
│           └── app.routes.ts # Routes configuration
└── SRS.md                   # Software Requirements Specification
```

## Development

### Running Migrations
Currently, migrations need to be run manually:
```bash
psql $DATABASE_URL < server/migrations/001_initial_schema.sql
```

### Creating Admin User
You can create an admin user using the seed script:
```bash
cd server
npm run seed
```

Or register through the frontend signup form (select "Admin" role).

## Notes

- The platform supports multi-tenancy - each admin has their own course
- Students must be enrolled by an admin to access course content
- Video URLs should be provided as external links (e.g., YouTube, Vimeo)
- File uploads for lesson attachments are not yet implemented in the frontend

## License

This project is part of a coursework/exercise.

