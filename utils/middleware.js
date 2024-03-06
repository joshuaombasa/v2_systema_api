const logger = require('./logger')

const requestlogger = (request, response, next) => {
    logger.info('Method', request.method)
    logger.info('Path', request.pat)
    logger.info('Body', request.body)
    logger.info('__')
    next()
}

const unknownendpointHandler =  (request, response, next) => {
    response.status(400).json({error: 'unknown endpoint'})
}

const errorHandling = (error,request, response, next) => {
    logger.error(error.message)
    next()
}

module.exports = {
    requestlogger,
    unknownendpointHandler,
    errorHandling
}