$("#connect_form").submit((ev) => {
    ev.preventDefault();
    let user_name = $("#user_name").val();
    if (user_name) {
        client_manager.connect(() => {
            client_manager.push_message("connect", {user_name:user_name});
        });
        client_manager.add_message_handler("client_accepted", (args) => {
            client_manager.user_own_id = args.client_id;
            client_manager.load_scene("lobby_list");
        });
    }
});