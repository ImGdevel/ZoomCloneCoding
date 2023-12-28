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

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const sockets = [];

wss.on("connection", (socket) => {
    console.log("Connected to Browser");
    sockets.push(socket);
    socket["nickname"] = "Anon"

    socket.on("close", ()=>{ 
        console.log("Disconnected to Browser");
    })

    socket.on("message", (message)=>{
        const parsed = JSON.parse(message.toString());
        switch(parsed.type){
            case "chat":
                sockets.forEach((sock) =>{
                    sock.send(`${socket.nickname}: ${parsed.message}`)
                })
                break;
            case "nick":
                socket["nickname"] = parsed.message;
                break;
            default:
        }
    })
});

server.listen(3000, handleListen);