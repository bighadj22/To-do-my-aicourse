'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import toast from 'react-hot-toast'
import type { Todo } from '@/types'

interface EditTodoFormProps {
  todo: Todo;
  currentUser: {
    id: string;
    email: string;
    role: string;
  };
}

interface ErrorResponse {
  error: string;
}

export default function EditTodoForm({ todo, currentUser }: EditTodoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [isPublic, setIsPublic] = useState(Number(todo.isPublic) === 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Updating todo...');

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          isPublic: isPublic ? 1 : 0
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse;
        throw new Error(errorData.error || 'Failed to update todo');
      }

      toast.success('Todo updated successfully', { id: toastId });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update todo',
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isPublic" 
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked as boolean)}
              name="isPublic"
            />
            <Label htmlFor="isPublic" className="cursor-pointer">
              Make this todo public
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="submit" 
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? 'Updating...' : 'Update Todo'}
          </Button>
          <Link href="/">
            <Button variant="outline">Cancel</Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}