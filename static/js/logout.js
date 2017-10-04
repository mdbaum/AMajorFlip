var url_prefix = "/vhwzma2k/p3";

//create an error paragraph and attach the paragraph to the class "errors" in user.html

$(document).ready(function(){
	$("#logout_form").submit(function(event){
	event.preventDefault();
	//document.getElementById("errors").innerHTML = ""

	$.ajax({
		type: "POST",
		contentType: "application/json",
		//data: JSON.stringify(),
		url: url_prefix + "/api/v1/logout",

		success: function(data, status){
			window.location.replace(url_prefix)
		},

		error: function(msg, status, error) {
			console.log("logout fail")
		}

	});

	});
});