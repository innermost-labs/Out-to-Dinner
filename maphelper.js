var applicationid = "oEhx7MD4NJ9dmwOTJVYIsDtSPRwxYYlXSwm13dI3";
var apikey = "jd6bIkiEcWb89gHyQUuMYhst6d6hkWkcB3ySWzUv";
var startlat = 38.971667;
var startlong = -95.235278;
var ajax;
var map;
var marker;
var publicmarkers = [];

function init(){
	makeMap();
	getMarkers();
}

function makeMap(){
  var coord = new google.maps.LatLng(startlat, startlong);
  var mapOptions = {
    center: coord,
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  map =  new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    google.maps.event.addListener(map, 'click', function(event) {
    addTempMarker(event.latLng);
  });
}



function getMarkers(){
	ajax = xmlhttp(function(){
		if(ajax.readyState == 4){
			var markers = eval( "(" + ajax.responseText + ")");
			for(var i = 0; i <= markers.results.length; i++)
			{
				publicmarkers.push(new google.maps.Marker({position:new google.maps.LatLng(markers.results[i].location.latitude, markers.results[i].location.longitude),map:map}));
			}
		}
	});
	ajax.open("GET", "https://api.parse.com/1/classes/markers",true);
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
  	content:"<div id='tempwindow'> <INPUT TYPE='button' NAME='addmarker' Value='Add to Map' onClick='addMarker("+location.lat()+","+location.lng()+")'>"
  });
  marker = new google.maps.Marker({
    position:location,
    map: map,
  });
  infowindow.open(map, marker);
}

function addMarker(lat, long){
		var ajax  = xmlhttp(function(){
			if(ajax.readyState == 4){
				document.getElementById("test").innerHTML = ajax.responseText;
				getMarkers();
			}
			
		});
		var sendMarker = '{"location": {"__type":"GeoPoint", "latitude":'+lat+', "longitude":'+long+'}}';

		ajax.open("POST", "https://api.parse.com/1/classes/markers",true);
		ajax.setRequestHeader("X-Parse-Application-Id", applicationid);
		ajax.setRequestHeader("X-Parse-REST-API-Key", apikey);
		ajax.setRequestHeader("Content-Type","application/json");
		ajax.send(sendMarker);
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

				del(markers.results[i].location.objectId);
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
