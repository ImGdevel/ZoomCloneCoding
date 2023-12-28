import http from "http"
import WebSocket from "ws";
import express from "express"
const app = express()
const port = 3000;

app.set('view engine', 'pug');
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) =>{
    res.render("home");
})

const handleListen = () => console.log("Listening on http://localHost:3000")

//console.log("Hello");
//app.listen(port);

const server = http.createServer(app);
const wss = new WebSocket.Server({server});


wss.on("connection", (socket) => {
    console.log("Connected to Browser");
    socket.on("close", ()=>{ console.log("Disconnected to Browser");})
    socket.send("Hello");
});

server.listen(3000, handleListen);