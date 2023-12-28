const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", ()=>{
    console.log("Conncted to Server");

})

socket.addEventListener("message", (message) =>{
    console.log("just got this:", message.data, "from server");
})

socket.addEventListener("close", (socket)=>{
    console.log("Disonnected server")
})