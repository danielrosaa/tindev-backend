if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes')

const app = express()
const server = require('http').Server(app)

const io = require('socket.io')(server)

const connectedUsers = {}

io.on('connection', socket => {
    const { user } = socket.handshake.query
    connectedUsers[user] = socket.id
})

mongoose.connect(process.env.DB_SERVER, {
    useNewUrlParser: true
})

app.use((req, res, next) => {
    req.io = io
    req.connectedUsers = connectedUsers

    return next()
})

app.use(cors()) // para poder ser usada pelo ReactJS
app.use(express.json())
app.use(routes)

server.listen(process.env.PORT || 3333, () => {
    console.log('Server running');
    console.log(process.env.NODE_ENV)
})