# Database Migrations

This directory contains SQL migrations for setting up and updating the database schema in Supabase.

## How to Apply Migrations

### Option 1: Using the Supabase Dashboard

1. Log in to your Supabase project dashboard
2. Navigate to the "SQL Editor" section
3. Click "New Query"
4. Copy and paste the contents of the SQL migration file
5. Click "Run" to execute the SQL statements

### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
supabase db push
```

## Schema Overview

The database schema includes the following tables:

- **accounts**: Stores financial accounts (bank accounts, cash, etc.)
- **tags**: Categories for transactions
- **transactions**: Financial transactions
- **transaction_tags**: Junction table linking transactions to tags
- **budgets**: Budget planning information

Each table includes:
- Primary keys (UUID)
- Timestamps (created_at, updated_at)
- Row Level Security (RLS) policies to ensure data privacy
- User association (user_id) for multi-tenant security

## Updating the Schema

When making changes to the schema:

1. Create a new migration file with an incremented number (e.g., 002_update_tables.sql)
2. Include SQL statements for the changes
3. Apply the migration using one of the methods above
