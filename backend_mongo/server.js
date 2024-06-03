require('dotenv').config()
const clear = require('clear');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const all_api = require('./api/allAPI');
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});


app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
});

app.use('/api', all_api);

mongoose.connect(process.env.MONGO_COMPASS_URI)
    .then(() => {
        console.log("Connected")
    }).catch((err) => {
        console.log(err)
    })

io.on("connection", (socket) => {
    //console.log(`User Connected: ${socket.id}`);

    socket.on("send_comment", (data) => {
        io.emit("receive_comment", data);
    });

    socket.on("send_like", (data) => {
        io.emit("receive_like", data);
    });

    socket.on("send_push_comment", (data) => {
        io.emit("receive_push_comment", data);
    });

    socket.on("send_push_like", (data) => {
        io.emit("receive_push_like", data);
    });

    socket.on("send_follow", (data) => {
        io.emit("receive_follow", data);
    });

    socket.on("new_message", (data) => {
        io.emit("receive_new_message", data);
    });
});

server.listen(process.env.PORT, () => {
    clear();
    console.log("Listening port - " + process.env.PORT);
})