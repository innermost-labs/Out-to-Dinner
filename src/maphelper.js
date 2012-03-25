var applicationid = "oEhx7MD4NJ9dmwOTJVYIsDtSPRwxYYlXSwm13dI3";
var apikey = "jd6bIkiEcWb89gHyQUuMYhst6d6hkWkcB3ySWzUv";
var lat = 38.971667;
var long = -95.235278;
var ajax;
var map;
var marker;
var publicmarkers = [];
var userId = 12;
var sessId = 12;
var infowindow = new google.maps.InfoWindow();

function makeMap(){
	var zoomlevel = 4;
	//arguments would be user Id and Session Id, otherwise the user isn't registered and we should use the public map instead.  
    var userHasNoMarker = false;
	if(arguments.length == 3){
		userId = arguments[0];
		sessId = arguments[1];
		markerId = arguments[2];
	//	var user = getUser(userId);
	    if(markerId){
	        var marker = getMarker(markerId);
			lat = marker.location.latitude;
			long = marker.location.longitude;
			zoomlevel = 8;	        
		}else{
			userHasNoMarker = true;
			
		}
	}
	var coord = new google.maps.LatLng(lat,long);
 	var mapOptions = {
    	center: coord,
    	zoom: zoomlevel,
    	mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    map =  new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    if(userHasNoMarker){
        google.maps.event.addListener(map, 'click', function(event) {
   		addTempMarker(event.latLng);
	    });
    }
    getMarkers();
}
function getMarkers(){
	ajax = xmlhttp(function(){
		if(ajax.readyState == 4){
			if(ajax.responseText != ""){
				var markers = eval("(" + ajax.responseText +")");
				for(var i = 0; i < markers.results.length; i++)
				{
					var tempmark = new google.maps.Marker({
						position:new google.maps.LatLng(markers.results[i].location.latitude, markers.results[i].location.longitude),
						map:map
					});
					publicmarkers.push({marker:tempmark, content:markers.results[i].content});	
					//need to figure out how to retrive a pin's information from the array/put it in the array so that it can be retrived later
					google.maps.event.addListener(tempmark, 'click', function(event) {
						for(var j = 0; j < publicmarkers.length; j++){
							if(publicmarkers[j].marker.position == event.latLng){
								infowindow.setContent("<div id = 'pincontent'>" + publicmarkers[j].content + "</div>");
								//todo make the content different based on whether the the owner is checking it or not, edit the pin
								infowindow.open(map, publicmarkers[j].marker);
							}
						}
			   		});
				}
			}
		}
	});
	ajax.open("GET", "https://api.parse.com/1/classes/markers/",true);
	ajax.setRequestHeader("X-Parse-Application-Id", applicationid);
	ajax.setRequestHeader("X-Parse-REST-API-Key", apikey);
	ajax.setRequestHeader("Content-Type","application/json");
	ajax.send();
}

function addTempMarker(location) {
  if(marker){
      marker.setMap(null);
  }
  infowindow = new google.maps.InfoWindow({
  	content:"<div id='tempwindow'> <INPUT TYPE='button' NAME='addmarker' Value='Add to Map' onClick='addMarker("+location.lat()+","+location.lng()+ ")'>"
  });
  marker = new google.maps.Marker({
    position:location,
    map: map,
  });
  infowindow.open(map, marker);
}

function addMarker(newlat, newlong, con){
		var ajax  = xmlhttp(function(){
			if(ajax.readyState == 4){
				if(ajax.responseText != ""){
					marker = eval('(' + ajax.responseText + ')');
					document.getElementById("test").innerHTML = ajax.responseText;
				//	editUser(userId, sessId,{markerId:marker.objectId});
					getMarkers();
				}
			}
			
		});
		var testjson = {location:{__type:"GeoPoint",latitude:newlat,longitude:newlong},ownerId:userId,content:con};
		var sendMarker = "{'location': {'__type':'GeoPoint', 'latitude':"+newlat+", 'longitude':"+newlong+"},'ownerId':"+userId+", 'content':'"+con+"'}";
		ajax.open("POST", "https://api.parse.com/1/classes/markers",true);
		ajax.setRequestHeader("X-Parse-Application-Id", applicationid);
		ajax.setRequestHeader("X-Parse-REST-API-Key", apikey);
		ajax.setRequestHeader("Content-Type","application/json");
		ajax.send(JSON.stringify(testjson));
	}

function xmlhttp(func){
	try{
		temp = new XMLHttpRequest();
	}catch(e){
		alert("ERROR SUBMITTING AJAX REQUEST");
	}
	temp.onreadystatechange = func;
	return temp;
}
function getMarker(markerId){
		ajax = xmlhttp(function(){
		if(ajax.readyState == 4){
			return  eval( "(" + ajax.responseText + ")");
		}
	});
	ajax.open("GET", "https://api.parse.com/1/classes/markers/" + markerId,true);
	ajax.setRequestHeader("X-Parse-Application-Id", applicationid);
	ajax.setRequestHeader("X-Parse-REST-API-Key", apikey);
	ajax.setRequestHeader("Content-Type","application/json");
	ajax.send();

}

function getUser(userId){
		ajax = xmlhttp(function(){
		if(ajax.readyState == 4){
			return eval( "(" + ajax.responseText + ")");
		}
	});
	ajax.open("GET", "https://api.parse.com/1/users/" + userId,true); //Sahar and Chris edited this line.
	ajax.setRequestHeader("X-Parse-Application-Id", applicationid);
	ajax.setRequestHeader("X-Parse-REST-API-Key", apikey);
	ajax.setRequestHeader("Content-Type","application/json");
	ajax.send();
	
}

function editUser(jsonToAdd){
	ajax = xmlhttp(function(){
		if(ajax.readyState == 4){
			return eval( "(" + ajax.responseText + ")");
		}
	});
	ajax.open("GET", "https://api.parse.com/1/classes/users" + userId,true);
	ajax.setRequestHeader("X-Parse-Application-Id", applicationid);
	ajax.setRequestHeader("X-Parse-REST-API-Key", apikey);
	ajax.setRequestHeader("Content-Type","application/json");
	ajax.setRequestHeader("X-Parse-Session-Token:", sessId);
	ajax.send(JSON.stringify(jsonToAdd));

}

function del(ID){
			var newthing  = xmlhttp(function(){
		
		});

		newthing.open("DELETE", "https://api.parse.com/1/classes/markers/"+ID,true);
		newthing.setRequestHeader("X-Parse-Application-Id", applicationid);
		newthing.setRequestHeader("X-Parse-REST-API-Key", apikey);
		newthing.send();
}

function deletealot(){
	ajax = xmlhttp(function(){
		if(ajax.readyState == 4){
			var markers = eval( "(" + ajax.responseText + ")");
							document.getElementById("test").innerHTML += ajax.responseText;

			for(var i = 0; i < markers.results.length; i++)
			{

				del(markers.results[i].objectId);
			}
			init();
		}
	});
	ajax.open("GET", "https://api.parse.com/1/classes/markers",true);
	ajax.setRequestHeader("X-Parse-Application-Id", applicationid);
	ajax.setRequestHeader("X-Parse-REST-API-Key", apikey);
	ajax.setRequestHeader("Content-Type","application/json");
	ajax.send();
	
}

function addtoarray(index, mark, info){
	publicmarkers[index] = {mark:mark, info:info};
}