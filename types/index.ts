import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users, todos } from '@/db/schema';

// Users types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Todos types
export type Todo = InferSelectModel<typeof todos>;
export type NewTodo = InferInsertModel<typeof todos>;

// Enum for user roles
export type UserRole = 'admin' | 'user';

// Explicitly define the schema types for better type safety
export interface DBUser {
    id: string;
    email: string;
    role: UserRole;
    createdAt: number;
}

export interface DBTodo {
    id: string;
    title: string;
    description: string | null;
    userId: string;
    createdAt: number;
    isPublic: number; // SQLite stores booleans as 0/1 numbers
}