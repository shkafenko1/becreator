-- Quick setup script for PostgreSQL
-- Run this as: sudo -u postgres psql -f setup-database.sql

-- Create user if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'yahor') THEN
        CREATE USER yahor WITH PASSWORD 'password123';
    END IF;
END
$$;

-- Grant privileges
ALTER USER yahor CREATEDB;

-- Drop database if exists (for clean setup)
DROP DATABASE IF EXISTS becreator;

-- Create database
CREATE DATABASE becreator OWNER yahor;

-- Connect to the new database and set permissions
\c becreator

-- Grant all privileges to yahor on the database
GRANT ALL PRIVILEGES ON DATABASE becreator TO yahor;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES FOR ROLE yahor IN SCHEMA public GRANT ALL ON TABLES TO yahor;
ALTER DEFAULT PRIVILEGES FOR ROLE yahor IN SCHEMA public GRANT ALL ON SEQUENCES TO yahor;

\q


