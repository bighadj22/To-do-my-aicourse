export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  userId: string;
}

export const mockUsers: User[] = [
  { id: 'user1', email: 'user1@example.com', role: 'user' },
  { id: 'user2', email: 'user2@example.com', role: 'user' },
  { id: 'admin1', email: 'admin@example.com', role: 'admin' },
];

export const mockTodos: Todo[] = [
  { id: '1', title: 'Learn Next.js', description: 'Study Server and Client Components', userId: 'user1' },
  { id: '2', title: 'Build a Todo App', description: 'Create a simple yet effective Todo application', userId: 'user2' },
  { id: '3', title: 'Implement User Authentication', description: 'Add user login and registration', userId: 'admin1' },
];

