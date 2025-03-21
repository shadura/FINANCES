-- Ensure is_one_time_purchase column exists in budgets table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'budgets'
        AND column_name = 'is_one_time_purchase'
    ) THEN
        ALTER TABLE budgets ADD COLUMN is_one_time_purchase BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;
