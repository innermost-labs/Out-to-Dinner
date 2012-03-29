
function delMarker(ID){
	alert('deleting marker');
			var newthing  = xmlhttp(function(){
			if(newthing.readyState == 4){
				alert(newthing.responseText);
				if(newthing.responseText != ""){
					alert("deleted " + ID);
				}
			}
		});
		newthing.open("DELETE", "https://api.parse.com/1/classes/markers/"+ID,true);
		newthing.setRequestHeader("X-Parse-Application-Id", applicationid);
		newthing.setRequestHeader("X-Parse-REST-API-Key", apikey);
		newthing.send();
}

function deletealot(){
	var ajax = xmlhttp(function(){
		if(ajax.readyState == 4){
			var markers = eval( "(" + ajax.responseText + ")");
							document.getElementById("test").innerHTML += ajax.responseText;

			for(var i = 0; i < markers.results.length; i++)
			{
				delMarker(markers.results[i].objectId, markers.results[i].owner);
			}
			makeMap();
		}
	});
	ajax.open("GET", "https://api.parse.com/1/classes/markers",true);
	ajax.setRequestHeader("X-Parse-Application-Id", applicationid);
	ajax.setRequestHeader("X-Parse-REST-API-Key", apikey);
	ajax.setRequestHeader("Content-Type","application/json");
	ajax.send();
	
}
