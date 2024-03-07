const Author = require('../models/author')
const authorsRouter = require('express').Router()
const bcrypt = require('bcrypt')

authorsRouter.get('/', async (request, response, next) => {
    try {
        const authors = await Author.find({}).populate('stories')
        response.json(authors)
    } catch (error) {
        next(error)
    }
})

authorsRouter.get('/:id', async (request, response, next) => {
    try {
        const author = await Author.findById(request.params.id).populate('stories')
        if (!author) {
            response.sendStatus(404)
        }
        response.json(author)
    } catch (error) {
        next(error)
    }
})

authorsRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body
    const saltrounds = 10
    const passwordHash = await bcrypt.hash(password, saltrounds)
    const author = new Author({
        username,
        name,
        passwordHash
    })
    try {
        const savedAuthor = await author.save()
        response.status(201).json(savedAuthor)
    } catch (error) {
        next(error)
    }
})

authorsRouter.put('/:id', async (request, response, next) => {
    const { username, name, password } = request.body

    const author = await Author.findById(request.params.id)
    if (!author) {
        response.sendStatus(404)
    }


    const saltrounds = 10
    const passwordHash = await bcrypt.hash(password, saltrounds)
    const authorData = {
        username,
        name,
        passwordHash
    }
    try {
        const aupdatedAuthor = await Author.findByIdAndUpdate(
            request.params.id,
            authorData,
            { new: true }
        )
    } catch (error) {
        next(error)
    }
})

authorsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Author.findByIdAndDelete(request.params.id)
    } catch (error) {
        next(error)
    }
})

module.exports = authorsRouter