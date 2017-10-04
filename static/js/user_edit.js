var url_prefix = "/vhwzma2k/p3";

//Current user
var username;

//using AJAX to get the current information and insert it into the form
$.ajax(url_prefix+"/api/v1/user",{
	type: "GET",
	contentType: "application/json",
	data: JSON.stringify(),
	success: function(data, status){
		username = data.username;
		/*
		document.getElementById("update_firstname_input").value = data.firstname;
		document.getElementById("update_lastname_input").value = data.lastname;
		document.getElementById("update_email_input").value = data.email;
		*/
		
	},
	error: function(msg, status, error){
		$(".error").remove();
		var errors = jQuery.parseJSON(msg.responseText).errors;
		for (var i = 0; i < errors.length; i++){
			attachError(errors[i].message);
		}
	}

});

function attachError(error_message){
	var error_paragraph = document.createElement('p');
	error_paragraph.innerHTML = error_message;
	error_paragraph.className = "error";
	document.getElementById("errors").appendChild(error_paragraph);
	return;
}

$(document).ready(function(){
	$("#update_user").submit(function(event){
		event.preventDefault();
		document.getElementById("errors").innerHTML = ""

		//First check if there is error, if no error then do AJAX call
		var is_error = false;

		//use a structure to get the message from html
		var form_send = {
			username: username,
			firstname: $("#update_firstname_input").val(),
			lastname: $("#update_lastname_input").val(),
			password1: $("#update_password1_input").val(),
			password2: $("#update_password2_input").val(),
			email: $("#update_email_input").val()
		};

		//Reference: http://stackoverflow.com/questions/21727456/jquery-value-match-regex
		//Use RegExp to test for validation

		//Error Checking
		//strings only contain letters, digits, and underscores
		var reg1 = RegExp("^[a-zA-Z0-9_]+$");

		//string must contain at least one letter and one number
		var reg2 = RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])");

		if (form_send.password1 || form_send.password2){
			if (form_send.password1.length < 8){
				is_error = true;
				attachError("Passwords must be at least 8 characters long");
			}

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
		}		


		var reg3 = RegExp("[^@]+@[^@]+\.[^@]+");
		if (!reg3.test(form_send.email)){
			is_error = true;
			attachError("Email address must be valid");
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
			console.log("There is error");
			console.log(form_send.password1);
			return;
		}

		//If no error, do AJAX call
		$.ajax({
			type: "PUT",
			contentType: "application/json",
			data: JSON.stringify(form_send),
			url: url_prefix + "/api/v1/user",
			success: function(data, status){
				console.log("User edit is successful!");
			},
			error: function(msg, status, error) {
				console.log(username);
				console.log("User editing is unsuccessful!")
				//console.log(msg.responseText['errors']);
				//get the errors from api
				var errors = JSON.parse(msg.responseText)['errors'];
				for (var i = 0; i < errors.length; i++){
					attachError(errors[i].message);
				}
			}

		});

	});
});