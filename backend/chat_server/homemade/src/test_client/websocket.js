console.log("Is this real ?");
    
let socket = new WebSocket("wss://javascript.info/article/websocket/demo/hello");

socket.onopen = function(e) {
  alert("[open] Connection established");
  alert("Sending to server");
  socket.send("My name is John");
};

socket.onmessage = function(event) {
  alert(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
  // e.g. server process killed or network down
  // event.code is usually 1006 in this case
  alert('[close] Connection died');
}
};

socket.onerror = function(error) {
alert(`[error] ${error.message}`);
};

/*
const Sockette = require('sockette');

const ws = new Sockette('localhost:5500', {
    timeout: 5e3,
    maxAttempts: 10,
    onopen: e => console.log('Connected!', e),
    onmessage: e => console.log('Received:', e),
    onreconnect: e => console.log('Reconnecting...', e),
    onmaximum: e => console.log('Stop Attempting!', e),
    onclose: e => console.log('Closed!', e),
    onerror: e => console.log('Error:', e)
});

console.log("Is this real ?")

ws.send('Hello, world!');
ws.json({type: 'ping'});
ws.close(); // graceful shutdown

// Reconnect 10s later
setTimeout(ws.reconnect, 10e3);
*/

