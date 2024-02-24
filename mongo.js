const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Error: password argument missing.')
    process.exit()
}

if (process.argv.length == 4) {
    console.log(`Error: make sure you called the app like this:
                
    node mongo.js password name number`)
    process.exit()
}

if (process.argv.length > 5) {
    console.log('Error: please use quotation marks for names with whitespace.')
    process.exit()
}

const password = process.argv[2]

const url = `mongodb+srv://mongoJones:${password}@cluster0.jr9heqj.mongodb.net/?
retryWrites=true&w=majority&appName=test`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const peopleSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', peopleSchema)

if (process.argv.length == 3) {
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

else {

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`Succesfully added ${result.name}!`)
        mongoose.connection.close()
    })
}