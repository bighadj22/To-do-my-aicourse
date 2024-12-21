import TodoList from '@/components/TodoList'
import { getUserTodos } from '@/utils/to-do'
import type { Todo } from '@/types'

export const runtime = 'edge'

export default async function Home() {
  // TODO: Replace with actual user auth
  const currentUser = {
    id: 'user1',
    email: 'user1@example.com',
    role: 'user'
  };

  // Fetch todos for the current user directly
  const userTodos = await getUserTodos(currentUser.id);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Todo List</h1>
      <p className="mb-4">Welcome, {currentUser.email} ({currentUser.role})</p>
      <TodoList initialTodos={userTodos} currentUserId={currentUser.id} />
    </main>
  )
}