var prefix = "/vhwzma2k/p3";
function album_load(albumid){
    $.ajax({
            url: "/vhwzma2k/p3/api/v1/album/" + albumid,
            type: "GET",  
            success: function(data){
                var access = data['access']; 
                var albumid = data['albumid'];
                var created = data['created'];
                var lastupdated = data['lastupdated'];
                var photos = data['pics'];
                var title = data['title'];
                var username = data['username'];
               
                $("#content").append("<a href = \"/vhwzma2k/p3/album/edit?albumid=" + albumid + "\">Edit</a>");
                // add title and username
                $("#content").append("<h3>"+title+"</h3>");
                $("#content").append("<h4>Owner: "+username + "</h4>");
                console.log(username+title+" added");
                // add pic
                for (i = 0; i < photos.length; i++){
                    $("#content").append("<tr>");
                    $("#content").append("<td><img onclick ='pic_handler(\"" +photos[i]["picid"]+ "\")' src='/static/images/" + photos[i]["picid"]+"."+photos[i]['format']+"' width = '42' height = '42' id = \"pic_"+photos[i]["picid"]+"_link\"></td>");
                    $("#content").append("<td>"+photos[i]["caption"]+"</td>");
                    $("#content").append("<td>"+photos[i]["date"]+"</td>");
                    console.log("/static/images/" + photos[i]["picid"]+"."+photos[i]['format']);
                    $("#content").append("</tr>");
                }
                
            },
            error: function(msg, status, error){
                console.log("error");
                var my_errors = jQuery.parseJSON(msg.responseText).errors;
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
        })
}

function pic_load(picid){
    var cur_user = ""; 
    var isown = false;
    var islogin = false;
    $.ajax({
        url: "/vhwzma2k/p3/api/v1/user",
        type: "GET",
        success: function(data){
            cur_user = data["username"];
            islogin = true;
        },
        error: function(msg){
            console.log("error");
        }
    })
    $.ajax({
            url: "/vhwzma2k/p3/api/v1/pic/" + picid,
            type: "GET",  
            success: function(data){
                var albumid = data['albumid'];
                var caption = data['caption'];
                var format = data['format'];
                var next = data['next'];
                var prev = data['prev'];
                var picid = data['picid'];
                var owner = "";
                $.ajax({
                    url: "/vhwzma2k/p3/api/v1/album/" + albumid,
                    type: "GET",
                    success: function(data){
                        owner = data["username"];
                        console.log("cur_user is "+ cur_user);
                        console.log("owner is "+owner);
                        if (owner != cur_user){
                            $("#content").append("<p id = \"pic_" + picid + "_caption\">Caption: " + caption+ "</p>");
                        }
                        //$("#content").append("<input type = \"text\" value = \"" + caption "\" id = \"pic_caption_input\" onkeydown = \"" )
                        else{
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
                                            push_state(picid, "pic");
                                            $("#pic_"+picid+"_caption").empty();
                                            $("#pic_"+picid+"_caption").append(data["caption"]);
                                        },
                                        error : function(msg) {
                                            console.log("error");
                                            var my_errors = jQuery.parseJSON(msg.responseText).errors;
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
                        }
                    },
                    error: function(msg){
                        console.log("error");
                        var my_errors = jQuery.parseJSON(msg.responseText).errors;
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
                })
                

                // add pic
                var image_element = document.createElement("IMG");
                image_element.src = "/static/images/" + picid + "." + format;
                document.getElementById('content').appendChild(image_element);
                // check if prev or next
                if (prev != ""){
                    /*var prev_element = document.createElement("p");
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
                    document.getElementById("content").appendChild(prev_element);*/
                    $("#content").append("<a onclick = 'pic_handler(\"" + prev + "\")' id = \"prev_pic\">Prev</a>");
                }
                if (next != ""){
                    /*var next_element = document.createElement("p");
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
                    document.getElementById("content").appendChild(next_element);*/
                    $("#content").append("<a onclick = 'pic_handler(\"" + next + "\")' id = \"next_pic\">Next</a>");
                }
            },
            error: function(msg, status, error){
                $("#content").append("haha");
            }   
        })
}

function pic_handler(picid){
    $("#content").empty();
    push_state(picid, "pic");
    pic_load(picid);
}

window.onpopstate=function(event){
    $("#content").empty();
    if (event.state!=null){
        if (event.state.stateVariable.option === "album"){
            album_load(event.state.stateVariable.id);
        }
        else {
            pic_load(event.state.stateVariable.id);
        }
    }
}

$(document).ready(function(){
    var url = window.location.href;
    var content_type = "album";
    if (url.indexOf("albumid") == -1){
        content_type = "pic";
    }
    var id = "";
    var targeturl = "";
    if (content_type == "album"){
        id = url.split("albumid=")[1];
        targeturl = "/album?albumid=" + id;
    }
    else{
        id = url.split("picid=")[1];
        targeturl = "/pic?picid=" + id;
    }
    var stateObj = {stateVariable: {id: id, option: content_type}};
    history.replaceState(stateObj, "title", prefix+targeturl);
    if (content_type == "album"){
        album_load(id);
    }
    else{
        pic_load(id);
    }
});

function push_state(id, option){
    var stateObj = {stateVariable: {id: id, option: option}}
    if (option === "album"){
        history.pushState(stateObj, "title", prefix+"/album?albumid="+id);
    }
    else {
        history.pushState(stateObj, "title", prefix+"/pic?picid="+id);
    }
}