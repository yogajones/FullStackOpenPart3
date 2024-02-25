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


app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(people => { response.json(people) })
        .catch(error => next(error))
})

// fix this in Ex 3.18 with proper error handling
/*app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})*/

app.get('/info', (request, response) => {
    const date = new Date().toString()
    peopleCount = 1 // fix this in Ex 3.18
    response.send(`
        <p>Phonebook has info for ${peopleCount} people</p>
        <p>${date}</p>
        `)
})

app.post('/api/persons', (request, response, next) => {
    const newPerson = new Person({
        name: request.body.name,
        number: request.body.number
    })

    if (!request.body.name || !request.body.number) {
        const error = new Error('Name or number cannot be empty')
        error.status = 400
        return next(error)
    }

    console.log(`Adding new person: ${newPerson.name}..`)
    newPerson.save()
        .then(savedPerson => {
            console.log(`..${savedPerson.name} added!`)
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const personToUpdate = {
        name: request.body.name,
        number: request.body.number,
    }

    Person.findByIdAndUpdate(request.params.id, personToUpdate, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: "Check the format of the person's ID" })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})