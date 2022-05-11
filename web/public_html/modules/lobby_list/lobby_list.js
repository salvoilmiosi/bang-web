$("#disconnect").click(() => client_manager.disconnect());

$("#make_lobby_form").submit(ev => {
    ev.preventDefault();

    let name = $("#lobby_name").val();
    if (name) {
        client_manager.push_message("lobby_make", {name:name});
    }
});

var $lobby_list_container = $("#lobby_list_container");
var lobby_list = {};

function remove_lobby_item(id) {
    if (id in lobby_list) {
        lobby_list[id].tag.remove();
        delete lobby_list[id];
    }
}

function update_lobby_item(args) {
    var item;
    if (!(args.lobby_id in lobby_list)) {
        item = lobby_list[args.lobby_id] = {};
        item.tag = $("<div>");
        item.tag.addClass("lobby_item");

        let text_name = $("<span>");
        item.tag.append(text_name);

        let text_nplayers = $("<span>");
        item.tag.append(text_nplayers);

        text_state = $("<span>");
        item.tag.append(text_state);

        let button_join = $("<button>");
        button_join.text("Entra");
        button_join.click(() => send_join_lobby(args.lobby_id));
        item.tag.append(button_join);

        item.update = (name, num_players, state) => {
            text_name.text(name);
            text_nplayers.text(`${num_players}/8`);
            text_state.text(state);
        };

        $lobby_list_container.append(item.tag);
    } else {
        item = lobby_list[args.lobby_id];
    }
    item.update(args.name, args.num_players, args.state);
}

function send_join_lobby(id) {
    client_manager.push_message("lobby_join", {lobby_id:id});
}

client_manager.add_message_handler("lobby_update", args => {
    if (args.num_players == 0) {
        remove_lobby_item(args.lobby_id);
    } else {
        update_lobby_item(args);
    }
});

client_manager.push_message("lobby_list");