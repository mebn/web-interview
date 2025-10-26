import React, { useState, useEffect } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)

  useEffect(() => {
    // prevent spamming requests on every keypress
    const timeout = setTimeout(() => {
      saveTodoList(todoList.id, { todos })
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
                onChange={(event) => {
                  setTodos([
                    // immutable update
                    ...todos.slice(0, index),
                    { ...todo, task: event.target.value },
                    ...todos.slice(index + 1),
                  ])
                }}
              />

              <TextField
                sx={{ marginTop: '1rem' }}
                label='Complete by'
                type='date'
                value={todo.completeBy || ''}
                InputLabelProps={{ shrink: true }}
                onChange={(event) => {
                  setTodos([
                    ...todos.slice(0, index),
                    { ...todo, completeBy: event.target.value },
                    ...todos.slice(index + 1),
                  ])
                }}
              />

              <Typography style={{ margin: '0 1rem' }}>
                {todo.completedAt ? '' : differenceInDays(todo.completeBy)}
              </Typography>

              <Button
                onClick={() => {
                  const completedAt = todo.completedAt ? null : new Date().toISOString()
                  setTodos([
                    // immutable update
                    ...todos.slice(0, index),
                    { ...todo, completedAt },
                    ...todos.slice(index + 1),
                  ])
                }}
              >
                {todo.completedAt ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
              </Button>

              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                onClick={() => {
                  setTodos([
                    // immutable delete
                    ...todos.slice(0, index),
                    ...todos.slice(index + 1),
                  ])
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}

          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, { task: '', completedAt: null, completeBy: null }])
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
