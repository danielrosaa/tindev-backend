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

mongoose.connect("mongodb+srv://daniel:danieldaniel@cluster0-rfpp0.mongodb.net/omnistack?retryWrites=true&w=majority", {
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

server.listen(process.env.PORT || 3333 )