'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import toast from 'react-hot-toast'
import type { Todo } from '@/types'

interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTodo: (todo: Todo) => void;
  userId: string;
}

// Type for the API request payload
interface CreateTodoPayload {
  title: string;
  description: string | null;
  userId: string;
  isPublic: number; // Using number for SQLite compatibility
}

export default function CreateTodoModal({ isOpen, onClose, onAddTodo, userId }: CreateTodoModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const toastId = toast.loading('Creating todo...');

    try {
      const payload: CreateTodoPayload = {
        title: title.trim(),
        description: description.trim() || null,
        userId,
        isPublic: isPublic ? 1 : 0 // Convert boolean to number for SQLite
      };

      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error((error as { message?: string }).message || 'Failed to create todo');
      }

      const newTodo: Todo = await response.json();
      onAddTodo(newTodo);
      
      toast.success('Todo created successfully', { id: toastId });

      // Reset form
      setTitle('')
      setDescription('')
      setIsPublic(false)
      onClose()
    } catch (error) {
      console.error('Error creating todo:', error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create todo",
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter todo title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter todo description"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isPublic" 
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked as boolean)}
            />
            <Label htmlFor="isPublic" className="cursor-pointer">
              Make this todo public
            </Label>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Todo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}