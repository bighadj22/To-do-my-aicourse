import { NextRequest } from 'next/server';
import { updateTodo, deleteTodo } from '@/utils/to-do';
import { z } from 'zod';

export const runtime = 'edge';

const updateTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  isPublic: z.number()
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Replace with your actual auth logic
    const currentUser = {
      id: 'user1',
      email: 'user1@example.com',
      role: 'user'
    };

    if (!currentUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateTodoSchema.parse(body);
    
    const updatedTodo = await updateTodo(params.id, currentUser.id, {
      title: validatedData.title,
      description: validatedData.description,
      isPublic: validatedData.isPublic
    });

    if (!updatedTodo) {
      return Response.json(
        { error: 'Todo not found or unauthorized' },
        { status: 404 }
      );
    }

    return Response.json(updatedTodo);
  } catch (error) {
    console.error('❌ [API] Error updating todo:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Replace with your actual auth logic
    const currentUser = {
      id: 'user1',
      email: 'user1@example.com',
      role: 'user'
    };

    if (!currentUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = await deleteTodo(params.id, currentUser.id);

    if (!success) {
      return Response.json(
        { error: 'Todo not found or unauthorized' },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('❌ [API] Error deleting todo:', error);
    return Response.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}