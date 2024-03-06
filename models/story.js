const mongoose = require('mongoose')

const storySchema = new mongoose.Schema({
    name: {type: String, required: true},
    body: {type: String, required: true},
    topic: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId},
})

storySchema.e