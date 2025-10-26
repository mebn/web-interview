import React, { useState, useEffect, useRef } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)
  const isTyping = useRef(false) // only debounce when typing
  const isFirstRender = useRef(true) // prevent server call on first render

  const updateTodo = (index, updates) => {
    setTodos((prev) => prev.map((todo, i) => (i === index ? { ...todo, ...updates } : todo)))
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!isTyping.current) {
      saveTodoList(todoList.id, { todos })
      return
    }
    const timeout = setTimeout(() => {
      saveTodoList(todoList.id, { todos })
      isTyping.current = false
    }, 200)

    return () => clearTimeout(timeout)
  }, [todos, todoList.id, saveTodoList])

  const differenceInDays = (completeBy) => {
    if (!completeBy) return 'No due date'

    const today = new Date()
    const dueDate = new Date(completeBy)

    const msPerDay = 1000 * 60 * 60 * 24
    const diffDays = Math.ceil((dueDate - today) / msPerDay)

    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    if (diffDays > 1) return `Due in ${diffDays} days`
    return `${Math.abs(diffDays)} days overdue`
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {todos.map((todo, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {index + 1}
              </Typography>

              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={todo.task}
                onChange={(e) => {
                  isTyping.current = true
                  updateTodo(index, { task: e.target.value })
                }}
              />

              <TextField
                sx={{ marginTop: '1rem' }}
                label='Complete by'
                type='date'
                value={todo.completeBy || ''}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  isTyping.current = true
                  updateTodo(index, { completeBy: e.target.value })
                }}
              />

              <Typography style={{ margin: '0 1rem' }}>
                {todo.completedAt ? '' : differenceInDays(todo.completeBy)}
              </Typography>

              <Button
                onClick={() =>
                  updateTodo(index, {
                    completedAt: todo.completedAt ? null : new Date().toISOString(),
                  })
                }
              >
                {todo.completedAt ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
              </Button>

              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                onClick={() => setTodos((prev) => prev.filter((_, i) => i !== index))}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}

          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() =>
                setTodos((prev) => [...prev, { task: '', completedAt: null, completeBy: null }])
              }
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
