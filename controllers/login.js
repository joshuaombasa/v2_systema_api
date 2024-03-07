const Author = require('../models/author')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

loginRouter.post('/', async (request, response, next) => {
    const { username, password } = request.body
    try {
        const author = await Author.findOne({ username })
        const isPasswordMatch = await bcrypt.compare(password, author.passwordHash)
        if (!(author && isPasswordMatch)) {
            return response.status(401).json({ rror: 'invalid credentials' })
        }
        const objectForToken = {
            username: author.username,
            id: author.id
        }

        const token = jwt.sign(objectForToken, process.env.SECRET, { validFor: 60 * 60 })
        response.json({ token, username: author.username, name: author.name })
    } catch (error) {
        next(error)
    }
})


module.exports = loginRouter