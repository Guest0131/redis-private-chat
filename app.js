
const express = require('express');
const config = require('config');
const http = require("http");
const socketIo = require("socket.io");


const { signInChat } = require('./libs/ChatsLib')
const { getAllMessages } = require('./libs/MessageLib')
const { refactorResultData, updateTable } = require('./libs/RefactorLib')



const app = express();

app.use(express.json({ extended: true }));
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/message', require('./routes/message.routes'))
app.use('/cardsets', express.static('cardsets'))


const server = http.createServer(app);
const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 200);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });

    socket.on("SignChat", (args) => {
        signInChat(args)
    })
});






const getApiAndEmit = async (socket) => {
    const messages = refactorResultData( await getAllMessages())
    socket.emit("GetMessages", messages);
  };

const PORT = config.get('port') || 5000
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
