import { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'
import { createTodo } from '@/utils/to-do'
import { z } from 'zod'
import type { Todo } from '@/types'

export const runtime = 'edge'

// Validation schema for request body
const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  userId: z.string().min(1, "User ID is required"),
  isPublic: z.number() // Expecting 0 or 1
});

type CreateTodoRequest = z.infer<typeof createTodoSchema>

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = createTodoSchema.parse(body);
    
    // Create todo in database
    const newTodo = await createTodo({
      title: validatedData.title,
      description: validatedData.description,
      userId: validatedData.userId,
      isPublic: validatedData.isPublic.toString()
    });

    return Response.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('❌ [API] Error creating todo:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}