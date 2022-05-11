$("#leave_lobby").click(() => client_manager.push_message("lobby_leave"));

var $lobby_title = $("#lobby_title");
var $checkboxes = $("#expansion_list >> input[type='checkbox']");
var $start_game = $("#start_game");
var $user_list = $("#user_list");

function init_lobby(lobby_info) {
    if (client_manager.user_own_id != client_manager.lobby_owner_id) {
        $checkboxes.prop("disabled", true);
    } else {
        $start_game.show();
        $start_game.click(() => client_manager.push_message("game_start"));
        $checkboxes.change(() => {
            client_manager.push_message("lobby_edit", {name: $lobby_title.text(),
                expansions: $checkboxes.filter(":checked").toArray().map(elem => elem.id)});
        });
    }
    update_lobby_info(lobby_info);
}

function update_lobby_info(lobby_info) {
    $lobby_title.text(lobby_info.name);
    $checkboxes.each(function() {
        $(this).prop("checked", lobby_info.expansions.includes(this.id));
    });
}

client_manager.add_message_handler("lobby_edited", update_lobby_info);

client_manager.add_message_handler("lobby_add_user", args => {
    let tag = $(`<div data-user_id="${args.user_id}">`);
    let user_name = $("<span>");
    user_name.text(args.name);
    tag.append(user_name);
    if (args.user_id == client_manager.lobby_owner_id) {
        tag.addClass("lobby_owner");
    }
    $user_list.append(tag);
    $start_game.prop("disabled", $user_list.children().length <= 1);
});

client_manager.add_message_handler("lobby_remove_user", args => {
    $user_list.find(`*[data-user_id="${args.user_id}"]`).remove();
    $start_game.prop("disabled", $user_list.children().length <= 1);
});