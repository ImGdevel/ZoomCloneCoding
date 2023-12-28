const socket = new WebSocket(`ws://${window.location.host}`);
const messageList = document.querySelector('ul');
const messageForm = document.querySelector('#message');
const nickForm = document.querySelector('#nick');

function makeMessage(type, message){
    const msg = {type, message};
    return JSON.stringify(msg);
}

socket.addEventListener("open", ()=>{
    console.log("Conncted to Server");

})

socket.addEventListener("message", (m) =>{
    const message = m.data.toString()
    const li = document.createElement('li');
    li.innerText = message;
    messageList.append(li);
    
})

socket.addEventListener("close", (socket)=>{
    console.log("Disonnected server")
})


messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("chat", input.value));
    input.value = "";
});

nickForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nick", input.value));
    input.value = "";
});
