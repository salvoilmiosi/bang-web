$("#game_leave").click(() => client_manager.push_message("lobby_leave"));

var $message_list = $("#message_list");
var $client_message_text = $("#client_message_text");

function append_object_to_list(args) {
    let $li = $("<li>");
    $li.text(JSON.stringify(args));
    $message_list.append($li);
    $client_message_text[0].scrollIntoView();
}

client_manager.add_message_handler("game_update", append_object_to_list);

$("#client_message_form").submit(ev => {
    ev.preventDefault();
    client_manager.push_message("game_action", JSON.parse($client_message_text.val()));
    $client_message_text.val('');
});

function init_game(game_options) {
    append_object_to_list(game_options);
}