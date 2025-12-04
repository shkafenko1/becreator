# Database Setup Instructions

## Quick Setup

Run these commands to set up the database:

```bash
# 1. Create PostgreSQL user and database
sudo -u postgres psql << 'EOSQL'
CREATE USER yahor WITH PASSWORD 'password123';
ALTER USER yahor CREATEDB;
CREATE DATABASE becreator OWNER yahor;
\q
EOSQL

# 2. Run migrations
cd server
PGPASSWORD=password123 psql -U yahor -d becreator -f migrations/001_initial_schema.sql

# 3. Seed admin user
npm run seed
```

## Alternative: Using createdb (if you have PostgreSQL user access)

```bash
createdb -U postgres becreator
PGPASSWORD=password123 psql -U yahor -d becreator -f migrations/001_initial_schema.sql
npm run seed
```

## Verify Setup

```bash
PGPASSWORD=password123 psql -U yahor -d becreator -c "SELECT tablename FROM pg_tables WHERE schemaname='public';"
```

You should see tables: users, courses, modules, lessons, etc.
