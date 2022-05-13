function show_error(message) {
    // TODO
    console.error(message);
}

function show_message(message) {
    // TODO
    console.log(message);
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
        "client_accepted": function(args) {
            this.user_own_id = args.user_id;
            this.load_scene("lobby_list");
        },
        "lobby_entered": function(args) {
            this.lobby_owner_id = args.owner_id;
            this.load_scene("lobby", () => init_lobby(args.info));
        },
        "lobby_add_user": function(args) {
            show_message(`${args.name} entra nella lobby`);
            this.users[args.user_id] = {name:args.name, propic:deserialize_image(args.profile_image)};
        },
        "lobby_remove_user": function(args) {
            if (args.user_id == this.user_own_id) {
                this.load_scene("lobby_list");
            } else {
                show_message(`${this.users[args.user_id].name} esce dalla lobby`);
            }
            delete this.users[args.user_id];
        },
        "lobby_error": show_error,
        "lobby_chat": function(args) {
            show_message(`${this.users[args.user_id].name}: ${args.message}`);
        },
        "game_started": function(args) {
            this.load_scene("game", () => init_game(args));
        }
    },

    load_scene(name, complete) {
        this.lock_messages = true;
        this.scene_message_handlers = {};
        $("#content").load(`/modules/${name}/${name}.html`, () => {
            if (complete) {
                complete();
            }
            this.lock_messages = false;
            this.handle_messages();
        });
    },

    connect(onopen) {
        this.ws = new WebSocket("ws://" + location.hostname + ":47654");
        this.ws.onopen = () => onopen();
        this.ws.onclose = this.ws.onerror = () => {
            this.ws = null;
            this.load_scene("connect");
        };
        this.ws.onmessage = ev => {
            this.in_queue.push(JSON.parse(ev.data));
            this.handle_messages();
        };
    },

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    },

    push_message(type, value) {
        if (this.ws) {
            this.ws.send(JSON.stringify({type:type,value:value}));
        }
    },

    handle_messages() {
        while (this.in_queue.length > 0 && !this.lock_messages) {
            let data = this.in_queue.shift();
            if (data.type in this.message_handlers) {
                this.message_handlers[data.type].call(this, data.value);
            }
            if (data.type in this.scene_message_handlers) {
                this.scene_message_handlers[data.type](data.value);
            }
        }
    },

    add_message_handler(type, fun) {
        this.scene_message_handlers[type] = fun;
    }
};

$(document).ready(() => client_manager.load_scene("connect"));