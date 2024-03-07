const Story = require('../models/story')
const storiesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Author = require('../models/author')

const getAuthToken = (request) => {
    const authorization = request.get('authorization')
    if (!authorization.startsWith('Bearer ')) {
        response.status(401).json({ error: 'token invalid/missing' })
    }
    return authorization.replace('Bearer ', '')
}

storiesRouter.get('/', async (request, response, next) => {
    try {
        const stories = await Story.find({}).populate('author')
        response.json(stories)
    } catch (error) {
        next(error)
    }
})

storiesRouter.get('/:id', async (request, response, next) => {
    try {
        const story = await Story.findById(request.params.id).populate('author')
        if (!story) {
            return response.sendStatus(404)
        }
        response.json(story)
    } catch (error) {
        next(error)
    }
})

storiesRouter.post('/', async (request, response, next) => {
    const { name, body, topic } = request.body
    const decoded = jwt.verify(getAuthToken(request), process.env.SECRET)
    if (!decoded.id) {
        response.status(401).json({ error: 'token invalid/missing' })
    }
    const author = await Author.findOne(decoded.id)
    const story = new Story({
        name,
        body,
        topic,
        author: author.id
    })
    try {
        const savedStory = await story.save()
        author.stories =  author.stories.concat(savedStory.id)
        response.status(201).json(story)
    } catch (error) {
        next(error)
    }
})

storiesRouter.delete('/:id', async (request, response, next) => {
    try {
        await Story.findByIdAndDelete(request.params.id)
        response.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

storiesRouter.put('/:id', async (request, response, next) => {
    const { name, body, topic } = request.body

    try {
        const story = await Story.findById(request.params.id)
        if (!story) {
            return response.sendStatus(404)
        }

        const storyData = {
            name,
            body,
            topic
        }
        const updatedStory = await Story.findByIdAndUpdate(
            request.params.id,
            storyData,
            { new: true }
        )
        response.status(201).json(updatedStory)
    } catch (error) {
        next(error)
    }
})


module.exports = storiesRouter