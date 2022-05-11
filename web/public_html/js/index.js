let client_manager = {
    ws: null,
    message_handlers: {},

    load_scene: (name) => {
        message_handlers = {};
        $("#content").load("/modules/"+name+".html");
    },

    connect: (onopen) => {
        let me = client_manager;
        me.ws = new WebSocket("ws://" + location.hostname + ":47654");
        me.ws.onopen = (ev) => onopen();
        me.ws.onclose = me.ws.onerror = () => {
            me.ws = null;
            me.load_scene("connect");
        };
        me.ws.onmessage = (ev) => {
            let data = JSON.parse(ev.data);
            if (data.type in me.message_handlers) {
                me.message_handlers[data.type].forEach(fun => fun(data.value));
            }
        };
    },

    disconnect: () => {
        let me = client_manager;
        if (me.ws) {
            me.ws.close();
        }
    },

    push_message: (type, value) => {
        let me = client_manager;
        if (me.ws) {
            me.ws.send(JSON.stringify({type:type,value:value}));
        }
    },

    add_message_handler: (type, fun) => {
        let me = client_manager;
        if (type in me.message_handlers) {
            me.message_handlers[type].push(fun);
        } else {
            me.message_handlers[type] = [fun];
        }
    }
};

$(document).ready(() => client_manager.load_scene("connect"));