const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const authenticationRouter = require('./routes/authentication')
const messagesRouter = require('./routes/messages')
require('dotenv').config({path: __dirname + '/.env'})

let app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.use('/authentication', authenticationRouter)
app.use('/messages', messagesRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.send('error')
})

app.listen(process.env.LISTEN_PORT, () => {
    console.log(`Listening on port ${process.env.LISTEN_PORT}`)
})

module.exports = app
