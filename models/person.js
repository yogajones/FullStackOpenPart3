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
    name: {
        type: String,
        minlength: 3,
    },
    number: {
        type: String,
        validate: {
            validator: number => {
                return /\d{2,3}-\d{5,}/.test(number) && number.length >= 8
            },
            message: number => `${number.value} is not valid. The number must contain 2 or 3 digits followed by a hyphen, followed by at least 5 more digits. The number must be at least 8 characters long, including the hyphen.`
        }
    }
})

peopleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', peopleSchema)