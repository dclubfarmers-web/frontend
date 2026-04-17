import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function Todos() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    async function getTodos() {
      const { data: todos, error } = await supabase.from('todos').select()

      if (error) {
        console.error('Error fetching todos:', error)
      } else if (todos) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Supabase Todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
      {todos.length === 0 && <p>No todos found. Make sure you have a 'todos' table with a 'name' column in your Supabase project.</p>}
    </div>
  )
}
