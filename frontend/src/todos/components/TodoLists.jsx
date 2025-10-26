import React, { Fragment, useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import DoneIcon from '@mui/icons-material/Done'
import { TodoListForm } from './TodoListForm'

const fetchTodoLists = async () => {
  const res = await fetch('http://localhost:3001/todolists')
  return res.json()
}

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()

  useEffect(() => {
    fetchTodoLists().then(setTodoLists)
  }, [])

  const saveTodoList = useCallback(
    async (id, { todos }) => {
      const res = await fetch('http://localhost:3001/updateTodos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, todos }),
      })

      if (!res.ok) {
        console.error('Something went wrong:', res.statusText)
        return
      }

      const updatedList = await res.json()

      setTodoLists((prev) => ({
        ...prev,
        [id]: { ...prev[id], todos: updatedList },
      }))
    },
    [setTodoLists]
  )

  const isListComplete = (list) =>
    list.todos.length > 0 && list.todos.every((todo) => todo.completedAt)

  if (!Object.keys(todoLists).length) return null

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {Object.keys(todoLists).map((key) => (
              <ListItemButton key={key} onClick={() => setActiveList(key)}>
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={todoLists[key].title} />
                {isListComplete(todoLists[key]) && <DoneIcon color='success' />}
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
      {todoLists[activeList] && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoLists[activeList]}
          saveTodoList={saveTodoList}
        />
      )}
    </Fragment>
  )
}
