import { createDb } from "@/db";
import { eq, sql, and, desc } from 'drizzle-orm';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { nanoid } from 'nanoid';
import { todos, users } from '@/db/schema';
import type { NewTodo, Todo } from '@/types/index';

// Get database instance
const getDb = () => {
  const DB = getRequestContext().env.DB;
  return createDb(DB);
};

export async function getAllTodos(): Promise<Todo[]> {
  console.log('📝 [getAllTodos] Starting to fetch all todos');
  const db = getDb();
  
  try {
    console.log('🔍 [getAllTodos] Executing database query');
    const allTodos = await db
      .select()
      .from(todos)
      .orderBy(desc(todos.createdAt));
    
    console.log(`✅ [getAllTodos] Successfully retrieved ${allTodos.length} todos`);
    return allTodos;
  } catch (error) {
    console.error('❌ [getAllTodos] Error fetching todos:', error);
    throw new Error('Failed to fetch todos');
  }
}


export async function getTodoById(id: string, userId: string): Promise<Todo | null> {
  console.log(`🔍 [getTodoById] Starting to fetch todo with id: ${id} for user: ${userId}`);
  const db = getDb();
  
  try {
    console.log('📝 [getTodoById] Executing database query with user check');
    const todo = await db
      .select()
      .from(todos)
      .where(
        and(
          eq(todos.id, id),
          eq(todos.userId, userId)
        )
      )
      .limit(1);
    
    if (todo.length === 0) {
      console.log('⚠️ [getTodoById] Todo not found or unauthorized access');
      return null;
    }

    console.log('✅ [getTodoById] Successfully retrieved authorized todo');
    return todo[0];
  } catch (error) {
    console.error('❌ [getTodoById] Error fetching todo:', error);
    throw new Error('Failed to fetch todo');
  }
}



export async function getUserTodos(userId: string): Promise<Todo[]> {
  console.log(`📝 [getUserTodos] Starting to fetch todos for user: ${userId}`);
  const db = getDb();
  
  try {
    console.log('🔍 [getUserTodos] Executing database query with user filter');
    const userTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId))
      .orderBy(desc(todos.createdAt));
    
    console.log(`✅ [getUserTodos] Successfully retrieved ${userTodos.length} todos for user`);
    return userTodos;
  } catch (error) {
    console.error('❌ [getUserTodos] Error fetching user todos:', error);
    throw new Error('Failed to fetch todos');
  }
}



export async function createTodo(todo: Omit<NewTodo, 'id' | 'createdAt'>): Promise<Todo> {
  console.log('📝 [createTodo] Starting to create new todo');
  const db = getDb();
  
  try {
    console.log('🔍 [createTodo] Preparing todo data');
    const newTodo: NewTodo = {
      id: nanoid(),
      title: todo.title,
      description: todo.description,
      userId: todo.userId,
      isPublic: todo.isPublic,
      createdAt: new Date().toISOString(),
    };

    console.log('📝 [createTodo] Executing database insert');
    await db.insert(todos).values(newTodo);
    
    console.log('✅ [createTodo] Successfully created todo');
    return newTodo as Todo;
  } catch (error) {
    console.error('❌ [createTodo] Error creating todo:', error);
    throw new Error('Failed to create todo');
  }
}


export async function updateTodo(
  id: string,
  userId: string,
  updates: {
    title: string;
    description: string | null;
    isPublic: number;
  }
): Promise<Todo | null> {
  console.log(`📝 [updateTodo] Starting to update todo ${id} for user ${userId}`);
  const db = getDb();
  
  try {
    // First check if the todo exists and belongs to the user
    const existingTodo = await getTodoById(id, userId);
    
    if (!existingTodo) {
      console.log('⚠️ [updateTodo] Todo not found or unauthorized access');
      return null;
    }

    console.log('📝 [updateTodo] Executing database update');
    await db
      .update(todos)
      .set({
        title: updates.title,
        description: updates.description,
        isPublic: updates.isPublic.toString(),
      })
      .where(
        and(
          eq(todos.id, id),
          eq(todos.userId, userId)
        )
      );

    // Get and return the updated todo
    const updatedTodo = await getTodoById(id, userId);
    console.log('✅ [updateTodo] Successfully updated todo');
    return updatedTodo;
  } catch (error) {
    console.error('❌ [updateTodo] Error updating todo:', error);
    throw new Error('Failed to update todo');
  }
}



export async function deleteTodo(id: string, userId: string): Promise<boolean> {
  console.log(`📝 [deleteTodo] Starting to delete todo ${id} for user ${userId}`);
  const db = getDb();
  
  try {
    // First check if the todo exists and belongs to the user
    const existingTodo = await getTodoById(id, userId);
    
    if (!existingTodo) {
      console.log('⚠️ [deleteTodo] Todo not found or unauthorized access');
      return false;
    }

    console.log('📝 [deleteTodo] Executing database delete');
    await db
      .delete(todos)
      .where(
        and(
          eq(todos.id, id),
          eq(todos.userId, userId)
        )
      );

    console.log('✅ [deleteTodo] Successfully deleted todo');
    return true;
  } catch (error) {
    console.error('❌ [deleteTodo] Error deleting todo:', error);
    throw new Error('Failed to delete todo');
  }
}