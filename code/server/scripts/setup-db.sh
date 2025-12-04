#!/bin/bash

# PostgreSQL Database Setup Script for BeCreator
# This script sets up the database, user, and runs migrations

set -e

echo "Setting up BeCreator database..."

# Try to connect and create user/database
# First, try using postgres user with peer authentication
if psql -U postgres -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✓ Connected to PostgreSQL as postgres user"
    
    # Create user if it doesn't exist
    psql -U postgres -d postgres -c "CREATE USER yahor WITH PASSWORD 'password123';" 2>/dev/null || echo "User may already exist"
    psql -U postgres -d postgres -c "ALTER USER yahor CREATEDB;" 2>/dev/null || echo ""
    
    # Create database
    psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS becreator;" 2>/dev/null || echo ""
    psql -U postgres -d postgres -c "CREATE DATABASE becreator OWNER yahor;" 2>/dev/null || echo ""
    
    echo "✓ Database created"
    
    # Run migrations
    echo "Running migrations..."
    export PGPASSWORD='password123'
    psql -U yahor -d becreator -f migrations/001_initial_schema.sql
    echo "✓ Migrations completed"
    
else
    echo "Cannot connect to PostgreSQL automatically."
    echo ""
    echo "Please run the following commands manually:"
    echo ""
    echo "sudo -u postgres psql <<EOF"
    echo "CREATE USER yahor WITH PASSWORD 'password123';"
    echo "ALTER USER yahor CREATEDB;"
    echo "CREATE DATABASE becreator OWNER yahor;"
    echo "\\q"
    echo "EOF"
    echo ""
    echo "Then run:"
    echo "PGPASSWORD=password123 psql -U yahor -d becreator -f migrations/001_initial_schema.sql"
fi


