const express = require('express')
const mongoSanitize = require('express-mongo-sanitize')
const dotenv = require('dotenv')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const userRouter = require('./routes/user')
const contactRouter = require('./routes/contact')
const errorHandler = require('./middlewares/errorHandler')
const connectDB = require('./db/db')


const app = express()

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV==='test') {
    dotenv.config({ path: './config/dev.env' })
    app.use(morgan('dev'))
}
// Mounting middleware
app.use(express.json())
app.use(cookieParser())
app.use(mongoSanitize())
// Set secure header
app.use(helmet())
// Mounting routers
app.use('/api/v1/users', userRouter)
app.use('/api/v1/contacts' , contactRouter)

// Global error handler
app.use(errorHandler)


const PORT = process.env.PORT || 5000
const start = () => {
    connectDB()
    app.listen(PORT, () => {
        console.log(`Server listening on port : ${PORT}`.cyan)
    })
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    // Close server & exit process
    server.close(() => process.exit(1))
})

module.exports = { app, start }
