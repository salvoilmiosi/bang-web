$("#connect_form").submit((ev) => {
    ev.preventDefault();
    let user_name = $("#user_name").val();
    if (user_name) {
        client_manager.connect(() => {
            client_manager.push_message("connect", {user_name:user_name});
        });
    }
});