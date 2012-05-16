var lat = 38.971667;
var long = -95.235278;
var map;

var publicmarkers = [];
var userId = null;
var markerId = null;
var infowindow = new google.maps.InfoWindow();

function makeMap(){
	//Just take userId as argument, if no argument show the public map
	if(arguments.length == 1){
		userId = arguments[0];
		return getUserMap(userId);
	}else{
		//Object used to make a new map
	 	var mapOptions = {
	    		center: new google.maps.LatLng(lat,long),
	    		zoom: 4,
	    		mapTypeId: google.maps.MapTypeId.SATELLITE
	    };
	    //make the map
	    map =  new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	    //populate the map
	    getMarkers();
	}
}

//creates a map centered on a user's marker
function getUserMap(userId){
	getUser(
		userId,
		function(data){
			if(data.markerID){
				//alert("markerId = " + data.markerID);
				markerId = data.markerID;
				parseApiCall(
					"GET",
					"classes/markers/" + data.markerID,
					null,
					function(markerData){
						if(markerData.objectId && markerData.location.latitude && markerData.location.longitude){
							//set the map options object that will be used to create the map
							mapOptions = {
								center: new google.maps.LatLng(markerData.location.latitude,markerData.location.longitude),
								zoom:8,
								mapTypeId: google.maps.MapTypeId.SATELLITE
							};
							//make the map
							map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
							//populate the map
							getMarkers();
						}else{
						// the markerId is invalid. make a new one?
							makeMap();
						}
					}
				);
			}else{
				//user has no markerID! do something about that
			}	makeMap();
		}
	);
}

//gets the user's data then calls the continuation with it
function getUser(userId, continuation){
	parseApiCall(
	"GET",
	"users/"+userId,
	null,
	continuation
	);
}

function getMarkers(){
	//blank all the markers in the publicmarkers array and then clear out the array
	for(i = 0; i < publicmarkers.length; i++){
		publicmarkers[i].marker.setMap(null);
	}
	publicmarkers = [];
	//get the all the markers, then add them to the publicmarkers array
	parseApiCall(
		"GET",
		"classes/markers",
		null,
		function(data)
		{
			//the image that the user's marker uses
			homeImage = "http://www.google.com/intl/en_us/mapfiles/ms/micons/purple-dot.png";
			for(i = 0; i < data.results.length; i++)
			{
				//make a temporary marker to be added to the array later
				var tempmark = new google.maps.Marker({
					position:new google.maps.LatLng(data.results[i].location.latitude, data.results[i].location.longitude),
					map:map
				});
				//if the marker's objectId is the same as the owner's markerId then we make change the icon
				if(data.results[i].objectId == markerId){
						alert("hello");
						tempmark.setIcon(homeImage);
				}
				//add the temporary marker and its associated data to the array so we can get to it later
				publicmarkers.push({marker:tempmark, content:data.results[i].content, objectId:data.results[i].objectId});
				/*
				//Allows you to click on a marker and view it's content.
				//Because we don't have any way of adding content right now this is commented out
				google.maps.event.addListener(tempmark, 'click', function(event) {
						for(var j = 0; j < publicmarkers.length; j++){
							if(publicmarkers[j].marker.position == event.latLng){
								if(publicmarkers[j].content != undefined){
								    var content = "<div id = 'pincontent'> " + publicmarkers[j].content +"</div>";
								}
								else{
								    var content = "<div id = 'pincontent'> </div>";
								}
								
								
								//alert(publicmarkers[j].objectId +" == " + markerId);
								if(publicmarkers[j].objectId == markerId){
									content +="<form>Edit Thoughts <INPUT TYPE='text' id='content_box'> <INPUT TYPE='button' NAME='addmarker' Value='Change Comments' onClick='addMarker("+publicmarkers[j].marker.getPosition().lat()+","+publicmarkers[j].marker.getPosition().lng()+ ")'></form>";
								}
								infowindow.setContent(content);
								infowindow.open(map, publicmarkers[j].marker);
							}
						}
			   		});
				*/


			}
		}
	);
}

//edits a marker, then calls getMarkers in update the map.
function editMarker(markerId, changedData){
	parseApiCall(
		"PUT",
		"classes/markers" + markerId,
		changedData,
		getMarkers
	);
}