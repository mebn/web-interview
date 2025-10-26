import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

let db = {
  '0000000001': {
    id: '0000000001',
    title: 'First List',
    todos: [{ task: 'First todo of first list!', completedAt: null, completeBy: null }],
  },
  '0000000002': {
    id: '0000000002',
    title: 'Second List',
    todos: [{ task: 'First todo of second list!', completedAt: null, completeBy: null }],
  },
}

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/todolists', (req, res) => res.json(db))

app.put('/updateTodos', (req, res) => {
  const { id, todos } = req.body

  if (!db[id]) {
    res.status(404).json({ error: 'Todo list not found' })
    return
  }

  if (!Array.isArray(todos)) {
    res.status(400).json({ error: 'Todos must be an array' })
    return
  }

  db[id].todos = todos

  res.status(200).json(db[id].todos)
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
