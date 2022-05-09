let addr = "ws://" + location.hostname + ":47654";
console.log(addr);
let ws = new WebSocket(addr);

ws.onopen = () => {
    console.log("ws open");
    ws.send(JSON.stringify({type:'connect', value:{name:'Salvo'}}));
};

ws.onclose = () => console.log("ws close");

ws.onerror = () => console.log("ws error");

ws.onmessage = (ev) => console.log("ws message: " + ev.data);