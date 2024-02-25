require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
morgan.token('request-body', (request, response) => JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'));

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5423523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary P",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const date = new Date().toString()
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        `)
})

app.post('/api/persons', (request, response) => {
    /*const nameExists = (name) => {
        return persons.find(person => person.name === name)
    }*/

    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number cannot be empty'
        })
    }
    /*if (nameExists(body.name)) {
        return response.status(400).json({
            error: 'a person with this name already exists'
        })
    }*/

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    console.log(`Adding new person: ${newPerson.name}..`)
    newPerson.save().then(savedPerson => {
        console.log(`..${savedPerson.name} added!`)
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})