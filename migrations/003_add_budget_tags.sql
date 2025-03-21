-- Create budget_tags junction table
CREATE TABLE IF NOT EXISTS budget_tags (
    budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (budget_id, tag_id)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE budget_tags ENABLE ROW LEVEL SECURITY;

-- Create policy for budget_tags based on budget ownership
CREATE POLICY "Users can only see their own budget tags" ON budget_tags 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM budgets 
        WHERE budgets.id = budget_tags.budget_id 
        AND budgets.user_id = auth.uid()
    )
);

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_budget_tags_budget_id ON budget_tags(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_tags_tag_id ON budget_tags(tag_id);
