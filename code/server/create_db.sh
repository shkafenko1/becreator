#!/bin/bash
# Database creation script - run with: bash create_db.sh

echo "Please run this command manually:"
echo "sudo -u postgres psql << 'EOSQL'"
echo "CREATE USER yahor WITH PASSWORD 'password123';"
echo "ALTER USER yahor CREATEDB;"
echo "CREATE DATABASE becreator OWNER yahor;"
echo "\\q"
echo "EOSQL"
echo ""
echo "Then run migrations with:"
echo "cd server && PGPASSWORD=password123 psql -U yahor -d becreator -f migrations/001_initial_schema.sql"
