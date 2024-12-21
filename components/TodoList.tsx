'use client'

import { useState } from 'react'
import TodoCard from './TodoCard'
import CreateTodoModal from './CreateTodoModal'
import { Button } from "@/components/ui/button"
import type { Todo } from '@/types'

interface TodoListProps {
  initialTodos: Todo[];
  currentUserId: string;
}

export default function TodoList({ initialTodos, currentUserId }: TodoListProps) {
  const [todos, setTodos] = useState(initialTodos)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo])
    setIsModalOpen(false)
  }

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)} className="mb-4">
        Add New Todo
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todos.map((todo) => (
          <TodoCard 
            key={todo.id} 
            todo={todo}
          />
        ))}
      </div>
      <CreateTodoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddTodo={handleAddTodo}
        userId={currentUserId}
      />
    </div>
  )
}