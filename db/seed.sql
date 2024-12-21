-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Todos table
CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index for faster todo lookups by user
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);

-- Insert mock users
INSERT INTO users (id, email, role) VALUES
    ('user1', 'user1@example.com', 'user'),
    ('user2', 'user2@example.com', 'user'),
    ('admin1', 'admin@example.com', 'admin');

-- Insert mock todos
INSERT INTO todos (id, title, description, user_id) VALUES
    ('1', 'Learn Next.js', 'Study Server and Client Components', 'user1'),
    ('2', 'Build a Todo App', 'Create a simple yet effective Todo application', 'user2'),
    ('3', 'Implement User Authentication', 'Add user login and registration', 'admin1');