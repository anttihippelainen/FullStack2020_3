const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')


morgan.token('data', function(req, res){
    return (JSON.stringify(req.body))
})

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040 123 3456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
    let date = new Date()
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        ${date}`
        )
    
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number of the person is missing' 
    })
  } 

  if (!persons.filter(p => p.name === body.name)){
      return response.status(400).json({
          error: 'name must be unique'
      })
  }

  const person = {
    name: body.name,
    number: (body.number),
    id: Math.ceil(Math.random()*1000000000),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})