$("#leave_lobby").click(() => client_manager.push_message("lobby_leave"));

var $lobby_title = $("#lobby_title");
var $checkboxes = $("#expansion_list >> input[type='checkbox']");
var $user_list = $("#user_list");

function init_lobby(lobby_info) {
    if (client_manager.user_own_id != client_manager.lobby_owner_id) {
        $checkboxes.prop("disabled", true);
    } else {
        $checkboxes.change(() => {
            client_manager.push_message("lobby_edit", {name: $lobby_title.text(),
                expansions: $checkboxes.filter(":checked").toArray()
                    .reduce((prev, elem) => (prev + elem.id + " "), "")});
        });
    }
    update_lobby_info(lobby_info);
}

function update_lobby_info(lobby_info) {
    $lobby_title.text(lobby_info.name);
    let expansions = lobby_info.expansions.split(' ');
    $checkboxes.each(function() {
        $(this).prop("checked", expansions.includes(this.id));
    });
}

client_manager.add_message_handler("lobby_edited", update_lobby_info);

client_manager.add_message_handler("lobby_add_user", args => {

});

client_manager.add_message_handler("lobby_remove_user", args => {

});