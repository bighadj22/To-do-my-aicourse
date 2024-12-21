'use client'

import Link from 'next/link'
import { Pencil, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Todo } from '@/types'

interface TodoViewProps {
  todo: Todo;
  currentUser: {
    id: string;
    email: string;
    role: string;
  };
}

export default function TodoView({ todo, currentUser }: TodoViewProps) {
  const formattedDate = todo.createdAt 
    ? new Date(todo.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Date not available';

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{todo.title}</span>
          {currentUser.id === todo.userId && (
            <Link href={`/edit/${todo.id}`}>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose max-w-none">
          <p className="text-gray-600">{todo.description}</p>
        </div>
        <div className="text-sm text-gray-500">
          Created: {formattedDate}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}