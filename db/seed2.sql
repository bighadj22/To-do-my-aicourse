-- Add isPublic column to todos table with a default value of false
ALTER TABLE todos
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false;

-- Create index for faster filtering of public todos
CREATE INDEX IF NOT EXISTS idx_todos_is_public ON todos(is_public);

-- Update existing todos to be private by default
UPDATE todos SET is_public = false WHERE is_public IS NULL;