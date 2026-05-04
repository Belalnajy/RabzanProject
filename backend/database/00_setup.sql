-- =============================================
-- Rabzan Trading Company — PostgreSQL Setup
-- =============================================
-- Run this as the PostgreSQL superuser (postgres)
-- Command: sudo -u postgres psql -f 00_setup.sql
-- =============================================

-- 1. Create the database user
CREATE USER rabzan_user WITH 
  PASSWORD 'Rabzan@2026!Secure'
  LOGIN
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE;

-- 2. Create the database
CREATE DATABASE rabzan_db
  WITH 
  OWNER = rabzan_user
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8'
  TEMPLATE = template0
  CONNECTION LIMIT = -1;

-- 3. Connect to the new database to set up grants
\c rabzan_db

-- 4. Grant privileges
GRANT ALL PRIVILEGES ON DATABASE rabzan_db TO rabzan_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO rabzan_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO rabzan_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO rabzan_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO rabzan_user;

-- 5. Enable UUID extension (needed for primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 6. Verify setup
\echo '========================================='
\echo '  Rabzan DB Setup Complete!'
\echo '  Database: rabzan_db'
\echo '  User:     rabzan_user'
\echo '  Password: Rabzan@2026!Secure'
\echo '========================================='
