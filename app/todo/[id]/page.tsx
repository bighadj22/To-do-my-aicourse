import { getTodoById } from '@/utils/to-do'
import { redirect } from 'next/navigation'
import TodoView from '@/components/TodoView'

export const runtime = 'edge'

export default async function TodoPage({ params }: { params: { id: string } }) {
  // TODO: Replace with your actual auth logic
  const currentUser = {
    id: 'user1',
    email: 'user1@example.com',
    role: 'user'
  };

  // If no user is logged in, redirect to home
  if (!currentUser) {
    redirect('/');
  }

  try {
    // Get todo with user authorization check
    const todo = await getTodoById(params.id, currentUser.id);

    // If todo doesn't exist or doesn't belong to user, redirect to home
    if (!todo) {
      console.log('🚫 [TodoPage] Todo not found or unauthorized access, redirecting');
      redirect('/');
    }

    return (
      <div className="container mx-auto p-4">
        <TodoView todo={todo} currentUser={currentUser} />
      </div>
    );
  } catch (error) {
    console.error('❌ [TodoPage] Error:', error);
    redirect('/');
  }
}

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Todo Details ${params.id}`,
  }
}