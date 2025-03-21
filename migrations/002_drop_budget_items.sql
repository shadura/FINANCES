-- This migration script drops the budget_items table and ensures the budgets table has all necessary columns

-- First, migrate any existing data from budget_items to budgets if budget_items exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'budget_items'
    ) THEN
        -- Insert data from budget_items to budgets
        INSERT INTO budgets (name, amount, currency_code, tags, period, start_date, user_id)
        SELECT 
            name, 
            amount, 
            currency AS currency_code, 
            tags, 
            'monthly' AS period, 
            created_at AS start_date, 
            user_id
        FROM budget_items;
    END IF;
END $$;

-- Drop budget_items table
DROP TABLE IF EXISTS budget_items;

-- Make sure budgets table has all necessary columns
-- Check if tags column exists, add if not
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'budgets'
        AND column_name = 'tags'
    ) THEN
        ALTER TABLE budgets ADD COLUMN tags UUID[] DEFAULT '{}';
    END IF;
END $$;

-- Add indexes to improve query performance
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'budgets' AND indexname = 'idx_budgets_user_id'
    ) THEN
        CREATE INDEX idx_budgets_user_id ON budgets(user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'budgets' AND indexname = 'idx_budgets_start_date'
    ) THEN
        CREATE INDEX idx_budgets_start_date ON budgets(start_date);
    END IF;
END $$;
