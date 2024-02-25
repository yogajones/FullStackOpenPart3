const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const uri = process.env.MONGODB_URI

console.log(`Connecting..`)
mongoose.connect(uri)
    .then(result => {
        console.log("..connected to MongoDB!")
    })
    .catch((error) => {
        console.log(`..error connecting to MongoDB: ${error.message}`);
    })

const peopleSchema = new mongoose.Schema({
    name: String,
    number: String,
})

peopleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', peopleSchema)