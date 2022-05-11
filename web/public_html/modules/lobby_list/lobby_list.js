$("#disconnect").click(() => client_manager.disconnect());

$("#make_lobby_form").submit(ev => {
    ev.preventDefault();

    let name = $("#lobby_name").val();
    if (name) {
        client_manager.push_message("lobby_make", {name:name});
    }
});

var $lobby_list = $("#lobby_list_container");

function find_lobby_item(id) {
    return $lobby_list.find(`*[data-lobby_id="${id}"]`);
}

function update_lobby_item(args) {
    let tag = find_lobby_item(args.lobby_id);
    if (tag.length == 0) {
        tag = $(`<div data-lobby_id="${args.lobby_id}">`);
        tag.addClass("lobby_item");

        let text_name = $("<span>");
        tag.append(text_name);

        let text_nplayers = $("<span>");
        tag.append(text_nplayers);

        text_state = $("<span>");
        tag.append(text_state);

        let button_join = $("<button>");
        button_join.text("Entra");
        button_join.click(() => send_join_lobby(args.lobby_id));
        tag.append(button_join);

        tag.data("update", (name, num_players, state) => {
            text_name.text(name);
            text_nplayers.text(`${num_players}/8`);
            text_state.text(state);
        });

        $lobby_list.append(tag);
    }
    tag.data("update")(args.name, args.num_players, args.state);
}

function send_join_lobby(id) {
    client_manager.push_message("lobby_join", {lobby_id:id});
}

client_manager.add_message_handler("lobby_update", args => {
    if (args.num_players == 0) {
        find_lobby_item(args.lobby_id).remove();
    } else {
        update_lobby_item(args);
    }
});

client_manager.push_message("lobby_list");