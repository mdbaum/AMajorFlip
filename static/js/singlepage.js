function loadcontent(){
    // reset all content
    $("#content").empty();
    // get current url
    var url = window.location.href;
    var content_type = "album";
    if (url.indexOf("albumid") == -1){
        content_type = "pic";
    }
    var id = "";
    if (content_type == "album"){
        id = url.split("albumid=")[1];
    }
    else{
        id = url.split("picid=")[1];
    }
    var target_url = "/vhwzma2k/p3/api/v1/" + content_type + "/" + id;


    if (content_type == "album"){
    //set ajax request
        $.ajax({
            url: target_url,
            type: "GET", 
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(), 
            success: function(data){
                var access = data['access']; 
                var albumid = data['albumid'];
                var created = data['created'];
                var lastupdated = data['lastupdated'];
                var photos = data['pics'];
                var title = data['title'];
                var username = data['username'];
               

                // add title and username
                $("#content").append("<h3>"+title+"</h3>");
                $("#content").append("<h4>Owner: "+username + "</h4>");
                console.log(username+title+" added");
                // add pic

                function link_to_pic(local_picid) {
                	console.log("Previous returned to same pic");
                    window.history.pushState({},"",window.location.href);
                    var newURL = "/vhwzma2k/p3/pic?picid=" + local_picid;
                    window.history.replaceState({},"pic",newURL);
                    window.history.go(0);
                }

                for (i = 0; i < photos.length; i++){
                    $("#content").append("<tr>");
                    var td_element = document.createElement("td");
                    var image_element = document.createElement("IMG");
                    var picid = photos[i]["picid"];
                    image_element.src = "/static/images/" + photos[i]["picid"] + "." + photos[i]["format"];
                    image_element.id = "pic_" + picid + "_link";
                    image_element.pic_id = photos[i]["picid"];
                    image_element.width = "50";
                    image_element.height = "50";
                    td_element.appendChild(image_element);
                    image_element.onclick = function() {link_to_pic(this.pic_id)};
                    /*
                    image_element.onclick = function(){
                        console.log("Previous returned to same pic");
                        window.history.pushState({},"",window.location.href);
                        var newURL = "/vhwzma2k/p3/pic?picid=" + picid;
                        window.history.replaceState({},"pic",newURL);
                        window.history.go(0);
                    }
                    */
                    document.getElementById('content').appendChild(td_element);

                    //$("#content").append("<td><img onclick = src='/static/images/" + photos[i]["picid"]+"."+photos[i]['format']+"' width = '42' height = '42'></td>");
                    $("#content").append("<td>"+photos[i]["caption"]+"</td>");
                    $("#content").append("<td>"+photos[i]["date"]+"</td>");
                    console.log("/static/images/" + photos[i]["picid"]+"."+photos[i]['format']);
                    $("#content").append("</tr>");
                }
                
            },
            error: function(msg, status, error){
                $("#content").append("haha");
            }   
        })
    }
    else if (content_type == "pic"){
        $.ajax({
            url: target_url,
            type: "GET", 
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(), 
            success: function(data){
                var albumid = data['albumid'];
                var caption = data['caption'];
                var format = data['format'];
                var next = data['next'];
                var prev = data['prev'];
                var picid = data['picid'];

                /*
                // test if user has edit permission
                var test_form_send = {
                     albumid: albumid,
                     caption: caption,
                     picid: picid
                }
                $.ajax({
                    type: "PUT", 
                    contentType: "application/json; charset=UTF-8",
                    data: JSON.stringify(test_form_send), 
                    url: "/vhwzma2k/p3/api/v1/pic/"+picid,
                    success : function(data) {
                        console.log("user has permission");
                        var input_text = document.createElement("input");
		                input_text.type = "text";
		                input_text.value = caption;
		                input_text.id = "pic_caption_input";
		                input_text.onkeydown = function(event){
		                    var e = event || window.event;
		                    caption = input_text.value;
		                    if (e.keyCode == 13){
		                        console.log("typed");
		                        var form_send = {
		                            albumid: albumid,
		                            caption: caption,
		                            picid: picid
		                        }
		                        $.ajax({
		                            type: "PUT", 
		                            contentType: "application/json; charset=UTF-8",
		                            data: JSON.stringify(form_send), 
		                            url: "/vhwzma2k/p3/api/v1/pic/"+picid,
		                            success : function(data) {
		                                console.log("success");
		                                },
		                            error : function(msg) {
		                                console.log("error");
		                                var errors = jQuery.parseJSON(msg.responseText).errors;
		                                var error_message = "";

		                                for (i = 0; i < my_errors.length; i++){
		                                    error_message = my_errors[i]['message'];
		                                    var error_para = document.createElement("p");
		                                    error_para.setAttribute("class", "error");
		                                    var error = document.createTextNode(error_message);
		                                    error_para.appendChild(error);
		                                    document.getElementById("content").appendChild(error_para);
		                                }
		                            }

		                        });
		                    }
		                }
		                document.getElementById('content').appendChild(input_text);
                        },
                    error : function(msg) {
                        console.log("user doesn't have permission");
		                var caption_element = document.createElement("p");
		                caption_element.id = "pic_" + picid + "_caption";
		                var caption_text = document.createTextNode(caption);
		                caption_element.appendChild(caption_text);
		                $("#content").append(caption_element);
                    }

                });
                */
                

                // add title and username
                
            
                var caption_element = document.createElement("p");
                caption_element.id = "pic_" + picid + "_caption";
                var caption_text = document.createTextNode(caption);
                caption_element.appendChild(caption_text);
                $("#content").append(caption_element);
        	
        		
                var input_text = document.createElement("input");
                input_text.type = "text";
                input_text.value = caption;
                input_text.id = "pic_caption_input";
                input_text.onkeydown = function(event){
                    var e = event || window.event;
                    caption = input_text.value;
                    if (e.keyCode == 13){
                        console.log("typed");
                        var form_send = {
                            albumid: albumid,
                            caption: caption,
                            picid: picid
                        }
                        $.ajax({
                            type: "PUT", 
                            contentType: "application/json; charset=UTF-8",
                            data: JSON.stringify(form_send), 
                            url: "/vhwzma2k/p3/api/v1/pic/"+picid,
                            success : function(data) {
                                console.log("success");
                                },
                            error : function(msg) {
                                console.log("error");
                                var errors = jQuery.parseJSON(msg.responseText).errors;
                                var error_message = "";

                                for (i = 0; i < my_errors.length; i++){
                                    error_message = my_errors[i]['message'];
                                    var error_para = document.createElement("p");
                                    error_para.setAttribute("class", "error");
                                    var error = document.createTextNode(error_message);
                                    error_para.appendChild(error);
                                    document.getElementById("content").appendChild(error_para);
                                }
                            }

                        });
                    }
                }
                document.getElementById('content').appendChild(input_text);
	            
	            
                
                // add pic
                var image_element = document.createElement("IMG");
                image_element.src = "/static/images/" + picid + "." + format;
                document.getElementById('content').appendChild(image_element);
                if (prev != ""){
                    var prev_element = document.createElement("p");
                    var prev_text = document.createTextNode("Prev");
                    prev_text.id = "prev_pic";
                    prev_element.appendChild(prev_text);
                    prev_element.onclick = function(){
                        console.log("Prev");
                        window.history.pushState({},"",window.location.href);
                        var newURL = "/vhwzma2k/p3/pic?picid=" + prev;
                        window.history.replaceState({},"prev",newURL);
                        window.history.go(0);
                    }
                    document.getElementById("content").appendChild(prev_element);
                }
                if (next != ""){
                    var next_element = document.createElement("p");
                    var next_text = document.createTextNode("Next");
                    next_element.appendChild(next_text);
                    next_text.id = "next_pic";
                    next_element.onclick = function(){
                        console.log("Prev");
                        window.history.pushState({},"",window.location.href);
                        var newURL = "/vhwzma2k/p3/pic?picid=" + next;
                        window.history.replaceState({},"next",newURL);
                        window.history.go(0);
                    }
                    document.getElementById("content").appendChild(next_element);
                }
            },
            error: function(msg, status, error){
                $("#content").append("haha");
            }   
        })
    }
}
window.onpopstate=function(event){
    loadcontent();
}
$(document).ready(function(){
	loadcontent();
});