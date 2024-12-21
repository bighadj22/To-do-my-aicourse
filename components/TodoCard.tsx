'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Trash2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast'
import type { Todo } from '@/types'

interface TodoCardProps {
  todo: Todo;
}

interface ErrorResponse {
  error: string;
}

export default function TodoCard({ todo }: TodoCardProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting todo...');

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse;
        throw new Error(errorData.error || 'Failed to delete todo');
      }

      toast.success('Todo deleted successfully', { id: toastId });
      router.refresh();
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete todo',
        { id: toastId }
      );
    }
  };

  return (
    <Card className="relative group">
      <Link href={`/todo/${todo.id}`} className="block">
        <CardContent className="pt-6 cursor-pointer group-hover:bg-gray-50">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            {todo.title}
            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h2>
          <p className="text-gray-600 line-clamp-2">{todo.description}</p>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-end space-x-2">
        <Link href={`/edit/${todo.id}`}>
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}