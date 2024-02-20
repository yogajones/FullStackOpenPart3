const express = require('express')
const app = express()

app.use(express.json())

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
    response.json(persons)
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

    const generateRandomId = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min)
    }

    const nameExists = (name) => {
        return persons.find(person => person.name === name)
    }

    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number cannot be empty'
        })
    }
    if (nameExists(body.name)) {
        return response.status(400).json({
            error: 'a person with this name already exists'
        })
    }

    const newPerson = {
        id: generateRandomId(1, 10e9),
        name: body.name,
        number: body.number
    }

    console.log(`Adding new person: ${newPerson.name}..`)
    persons = persons.concat(newPerson)
    console.log(`..${newPerson.name} added!`)

    response.json(newPerson)

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})