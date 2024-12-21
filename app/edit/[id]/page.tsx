import { getTodoById } from '@/utils/to-do'
import { redirect } from 'next/navigation'
import EditTodoForm from '@/components/EditTodoForm'

export const runtime = 'edge'

export default async function EditTodoPage({ params }: { params: { id: string } }) {
  // TODO: Replace with your actual auth logic
  const currentUser = {
    id: 'user1',
    email: 'user1@example.com',
    role: 'user'
  };

  if (!currentUser) {
    redirect('/');
  }

  try {
    const todo = await getTodoById(params.id, currentUser.id);

    if (!todo) {
      console.log('🚫 [EditTodo] Unauthorized access or todo not found, redirecting');
      redirect('/');
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Edit Todo</h1>
        <EditTodoForm todo={todo} currentUser={currentUser} />
      </div>
    );
  } catch (error) {
    console.error('❌ [EditTodo] Error:', error);
    redirect('/');
  }
}