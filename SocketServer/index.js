const app = require("express")();
const cors = require('cors')
app.use(cors())

const { createServer } = require("http");
const httpServer = createServer(app);

const users = new Set()

const io = require('socket.io')(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
    methods: ['GET', 'POST']
})

io.on("connection", (socket) => {
    console.log(socket.id)
    users.add(socket.id)

    socket.on('send', ({ message }) => {
        socket.emit('selfMessageToChat', { id: socket.id, message })
        socket.broadcast.emit('messageToChat', { id: socket.id, message })
    })

});
io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

httpServer.listen(4000, () => {
    console.log('Server Started at 4000')
})