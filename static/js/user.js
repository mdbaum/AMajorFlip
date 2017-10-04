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
	$("#new_user").submit(function(event){
			event.preventDefault();
			document.getElementById("errors").innerHTML = ""

			//First check if there is error, if no error then do AJAX call
			var is_error = false;

			//use a structure to get the message from html
			var form_send = {
				username: $("#new_username_input").val(),
				firstname: $("#new_firstname_input").val(),
				lastname: $("#new_lastname_input").val(),
				password1: $("#new_password1_input").val(),
				password2: $("#new_password2_input").val(),
				email: $("#new_email_input").val()
			};

			//Reference: http://stackoverflow.com/questions/21727456/jquery-value-match-regex
			//Use RegExp to test for validation

			//Error Checking
			if (form_send.username.length < 3){
				is_error = true;
				attachError("Usernames must be at least 3 characters long");
			}

			//strings only contain letters, digits, and underscores
			var reg1 = RegExp("^[a-zA-Z0-9_]+$");
			if (!reg1.test(form_send.username)){
				is_error = true;
				attachError("Usernames may only contain letters, digits, and underscores");
			}

			if (form_send.password1.length < 8){
				is_error = true;
				attachError("Passwords must be at least 8 characters long");
			}

			//string must contain at least one letter and one number
			var reg2 = RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])");
			if (!reg2.test(form_send.password1)){
				is_error = true;
				attachError("Passwords must contain at least one letter and one number");
			}
			if (!reg1.test(form_send.password1)){
				is_error = true;
				attachError("Passwords may only contain letters, digits, and underscores");
			}

			if (form_send.password1 != form_send.password2){
				is_error = true;
				attachError("Passwords do not match");
			}


			var reg3 = RegExp("[^@]+@[^@]+\.[^@]+");
			if (!reg3.test(form_send.email)){
				is_error = true;
				attachError("Email address must be valid");
			}

			if (form_send.username.length > 20){
				is_error = true;
				attachError("Username must be no longer than 20 characters");
			}

			if (form_send.firstname.length > 20){
				is_error = true;
				attachError("Firstname must be no longer than 20 characters");
			}

			if (form_send.lastname.length > 20){
				is_error = true;
				attachError("Lastname must be no longer than 20 characters");
			}

			if (form_send.email.length > 40){
				is_error = true;
				attachError("Email must be no longer than 40 characters");
			}

			//If there is error, return immediately and don't do AJAX call
			if (is_error){
				return;
			}

			//If no error, do AJAX call
			$.ajax({
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(form_send),
				url: url_prefix + "/api/v1/user",
				success: function(data, status){
					console.log("User creation is successful!")
					window.location.replace(url_prefix+"/login");
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