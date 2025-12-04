#!/bin/bash
# Automated database setup for BeCreator

set -e

echo "=== BeCreator Database Setup ==="
echo ""

# Step 1: Create PostgreSQL user and database
echo "Step 1: Creating PostgreSQL user and database..."
sudo -u postgres psql << 'EOSQL' || {
    echo ""
    echo "ERROR: Could not run sudo command. Please run manually:"
    echo ""
    echo "sudo -u postgres psql << 'EOSQL'"
    echo "CREATE USER yahor WITH PASSWORD 'password123';"
    echo "ALTER USER yahor CREATEDB;"
    echo "CREATE DATABASE becreator OWNER yahor;"
    echo "\\q"
    echo "EOSQL"
    exit 1
}

-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'yahor') THEN
        CREATE USER yahor WITH PASSWORD 'password123';
    END IF;
END
\$\$;

-- Grant privileges
ALTER USER yahor CREATEDB;

-- Drop and recreate database
DROP DATABASE IF EXISTS becreator;
CREATE DATABASE becreator OWNER yahor;

\q
EOSQL

echo "✓ Database created"
echo ""

# Step 2: Run migrations
echo "Step 2: Running database migrations..."
cd server
export PGPASSWORD=password123
psql -U yahor -d becreator -f migrations/001_initial_schema.sql

echo "✓ Migrations completed"
echo ""

# Step 3: Seed admin user
echo "Step 3: Seeding admin user..."
npm run seed

echo ""
echo "=== Database Setup Complete ==="
echo "You can now start the server with: npm run dev"
