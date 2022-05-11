init_lobby = (lobby_info) => $("#lobby_title").text(lobby_info.name);

$("#leave_lobby").click(() => client_manager.push_message("lobby_leave"));

client_manager.add_message_handler("lobby_edited", (args) => {

});

client_manager.add_message_handler("lobby_add_user", (args) => {

});

client_manager.add_message_handler("lobby_remove_user", (args) => {

});