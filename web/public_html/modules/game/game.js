var $message_list = $("#message_list");
var $client_message_text = $("#client_message_text");

$("#game_leave").click(() => client_manager.push_message("lobby_leave"));

$("#client_message_form").submit(ev => {
    ev.preventDefault();
    client_manager.push_message("game_action", JSON.parse($client_message_text.val()));
    $client_message_text.val('');
});

function append_object_to_list(args) {
    let $li = $("<li>");
    $li.text(JSON.stringify(args));
    $message_list.append($li);
    $client_message_text[0].scrollIntoView();
}

var game_manager = {
    message_queue: [],

    init() {
        this.tick_interval = setInterval(() => this.next_message(), 100);
    },

    cleanup() {
        clearInterval(this.tick_interval);
    },

    push_message(message) {
        this.message_queue.push(message);
    },

    next_message() {
        if (this.message_queue.length > 0) {
            append_object_to_list(this.message_queue.shift());
        }
        console.log('update');
    }
};

function init_game(game_options) {
    game_manager.push_message(game_options);
    game_manager.init();

    return game_manager;
}

client_manager.add_message_handler("game_update", message => game_manager.push_message(message));