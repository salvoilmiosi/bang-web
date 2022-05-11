$("#game_leave").click(() => client_manager.push_message("lobby_leave"));

// var message_queue = [];
var $message_list = $("#message_list");
var $client_message_text = $("#client_message_text");

client_manager.add_message_handler("game_update", (args) => {
    let $li = $("<li>");
    $li.text(JSON.stringify(args));
    $message_list.append($li);
    $client_message_text[0].scrollIntoView();
    // message_queue.push(args);
});

$("#client_message_form").submit((ev) => {
    ev.preventDefault();
    client_manager.push_message("game_action", JSON.parse($client_message_text.val()));
    $client_message_text.val('');
});