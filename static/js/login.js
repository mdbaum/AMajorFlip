var url_prefix = "/vhwzma2k/p3";

//create an error paragraph and attach the paragraph to the class "errors" in user.html
function attachError(error_message){
	var error_paragraph = document.createElement('p');
	error_paragraph.innerHTML = error_message;
	error_paragraph.className = "error";
	document.getElementById("errors").appendChild(error_paragraph);
	return;
}

$(document).ready(function(){
	$("#login_form").submit(function(event){
	event.preventDefault();
	document.getElementById("errors").innerHTML = ""

	var form_send = {
		username: $("#login_username_input").val(),
		password: $("#login_password_input").val()
	};


	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(form_send),
		url: url_prefix + "/api/v1/login",

		success: function(data, status){
			var urlQuery = window.location.href.indexOf("url=");
			if (urlQuery == -1){
				console.log("login redirect to home page");
				window.location.replace(url_prefix);
			}
			else{
				console.log("login redirect to single page");
				window.location.replace(widow.location.href.split("url=")[1])
			}


		},

		error: function(msg, status, error) {
			//get the errors from api
			var errors = jQuery.parseJSON(msg.responseText).errors;
			for (var i = 0; i < errors.length; i++){
				attachError(errors[i].message);
			}
		}

	});

	});
});
