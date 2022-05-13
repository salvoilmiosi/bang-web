var $propic = $("#propic");

$("#propic_file").change(e => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = () => {
        $propic.attr("src", reader.result);
        $propic.show();
    };
    if (file) {
        reader.readAsDataURL(file);
    }
});

$("#connect_form").submit(ev => {
    ev.preventDefault();
    let user_name = $("#user_name").val();
    if (user_name) {
        client_manager.connect(() => client_manager.push_message("connect",
            {user_name:user_name, profile_image:serialize_image($propic[0], 50)})
        );
    }
});