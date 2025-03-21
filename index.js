import express from 'express'
import dotenv from 'dotenv'
import CORS from 'cors'
import requestLogger from './src/Middlewares/logger.middleware.js'
import errorHandler from './src/Middlewares/errorhandler.middleware.js'
import colors from 'colors'
import connectDB from './src/Config/db.js'
import { userRoutes, assetRoutes } from './src/Routes/index.js'
import { app, server } from './src/Web/socket.service.js'
import { updatePortfolioPrices } from './src/Services/alphaVantage.service.js'

dotenv.config()

app.use(requestLogger)

const PORT = process.env.PORT || 8088

connectDB()

app.use(express.json())

app.use(
  CORS({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.get('/', (req, res) => {
  res.send(`<h1>Server is running</h1>`)
})

app.use('/api/user', userRoutes)
app.use('/api/asset', assetRoutes)

// setInterval(updatePortfolioPrices, 10000)

app.use(errorHandler)

server.listen(PORT, () => {
  console.log(`Server running on port ${`http://localhost:${PORT}`.blue}`)
})
