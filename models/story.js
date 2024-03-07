const mongoose = require('mongoose')

const storySchema = new mongoose.Schema({
    name: {type: String, required: true},
    body: {type: String, required: true},
    topic: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
})

storySchema.set('toJSON', {
    transform : (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Story', storySchema)