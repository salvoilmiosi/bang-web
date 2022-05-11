function show_error(message) {
    // TODO
    console.error(message);
}

function show_message(message) {
    // TODO
    console.log(message);
}

function deserialize_propic(propic) {
    // TODO
    return null;
}

let client_manager = {
    ws: null,
    in_queue: [],
    lock_messages: false,

    scene_message_handlers: {},

    user_own_id: 0,
    lobby_owner_id: 0,

    users: {},

    message_handlers: {
        "client_accepted": (args) => {
            let me = client_manager;
            me.user_own_id = args.user_id;
            me.load_scene("lobby_list");
        },
        "lobby_error": show_error,
        "lobby_entered": (args) => {
            let me = client_manager;
            me.lobby_owner_id = args.owner_id;
            me.load_scene("lobby", () => init_lobby(args.info));
        },
        "lobby_add_user": (args) => {
            let me = client_manager;
            show_message(`${args.name} entra nella lobby`);
            me.users[args.user_id] = {name:args.name, propic:deserialize_propic(args.propic)};
        },
        "lobby_remove_user": (args) => {
            let me = client_manager;
            if (args.user_id == me.user_own_id) {
                me.load_scene("lobby_list");
            } else {
                show_message(`${me.users[args.user_id].name} esce dalla lobby`);
            }
            delete me.users[args.user_id];
        },
        "lobby_chat": (args) => {
            let me = client_manager;
            show_message(`${me.users[args.user_id].name}: ${args.message}`);
        },
        "game_started": () => {
            let me = client_manager;
            me.load_scene("game");
        }
    },

    load_scene: (name, complete) => {
        let me = client_manager;
        me.lock_messages = true;
        me.scene_message_handlers = {};
        $("#content").load("/modules/"+name+".html", () => {
            if (complete) {
                complete();
            }
            me.lock_messages = false;
            me.handle_messages();
        });
    },

    connect: (onopen) => {
        try {
            let me = client_manager;
            me.ws = new WebSocket("ws://" + location.hostname + ":47654");
            me.ws.onopen = (ev) => onopen();
            me.ws.onclose = me.ws.onerror = () => {
                me.ws = null;
                me.load_scene("connect");
            };
            me.ws.onmessage = (ev) => {
                me.in_queue.push(JSON.parse(ev.data));
                me.handle_messages();
            };
        } catch (error) {
            show_error("Errore in connessione");
        }
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

    handle_messages: () => {
        let me = client_manager;
        while (me.in_queue.length > 0 && !me.lock_messages) {
            let data = me.in_queue.shift();
            if (data.type in me.message_handlers) {
                me.message_handlers[data.type](data.value);
            }
            if (data.type in me.scene_message_handlers) {
                me.scene_message_handlers[data.type](data.value);
            }
        }
    },

    add_message_handler: (type, fun) => {
        let me = client_manager;
        me.scene_message_handlers[type] = fun;
    }
};

$(document).ready(() => client_manager.load_scene("connect"));