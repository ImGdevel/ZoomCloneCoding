import http from "http"
import express from "express"
import SocketIO from "socket.io";
import { Socket } from "dgram";
import { EventEmitter } from "stream";

const app = express()
const port = 3000;

app.set('view engine', 'pug');
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) =>{
    res.render("home");
})

const handleListen = () => console.log("Listening on http://localHost:3000")

const httpServer = http.createServer(app);
const WsServer = SocketIO(httpServer);

function publicRooms(){
    
    const { rooms, sids } = WsServer.sockets.adapter;

    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) == undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
}



WsServer.on("connection", (socket) => {

    socket["nickname"] = "Anon"

    socket.onAny((event)=>{
        console.log(`Socket event: ${event}`);
    })

    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
        WsServer.sockets.emit("room_change", publicRooms());
    });

    socket.on("disconnecting", ()=>{
        socket.rooms.forEach((room) => {
            socket.to(room).emit("bye", socket.nickname);
        });
    });

    socket.on("disconnect", ()=>{
        WsServer.sockets.emit("room_change", publicRooms());
    })

    socket.on("new_message", (msg, room,done)=>{
        socket.to(room).emit("new_message",`${socket.nickname}: ${msg}` );
        done();
    });

    socket.on("nickname", (nickname)=>{
        socket["nickname"] = nickname;
    });

})

httpServer.listen(3000, handleListen);