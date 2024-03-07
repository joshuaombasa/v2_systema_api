const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')

const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const storiesRouter = require('./controllers/stories')
const authorsRouter = require('./controllers/authors')

const app = express()

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
    .then(() => logger.info(`connected to MongoDB`))
    .catch(error => logger.error(error.message))

app.use(express.json())
app.use(cors())

app.use(middleware.requestlogger)

app.use('/api/stories', storiesRouter)
app.use('/api/authors', authorsRouter)

app.use(middleware.unknownendpointHandler)
app.use(middleware.errorHandling)

module.exports = app