require('dotenv').config()
const express = require('express')
const morgan = require("morgan")
const cors = require('cors')
const Person = require('./models/person')

morgan.token("body", (request) => JSON.stringify(request.body))


const app = express()



app.use(express.static('build'))
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(cors())




// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]


app.get('/info', (request, response) => {
    const len = persons.length
    const date = new Date()
    response.send(`
    <p>Phonebook has info for ${len} people</p>
    <p>${date}</p>
    `)
  })
  

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
      console.log(persons)
    })
  })


app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end() 
        }
      })
      .catch(error => next(error))
  })


  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name is missing' 
      })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number is missing' 
        })
      }

  
    const person = new Person ({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
        response.json(savedPerson)
      })
  })

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }

  app.use(errorHandler)
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  }) 