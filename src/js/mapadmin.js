var millis = 300;
//tries to add markers for users that already exist but don't have markers sort of works, but runs into google quota problems because it tries to do to many geocodes in a minute, if you run it over and over again you get more and more markers
function addMarker(){
	document.getElementById("map_canvas").innerHTML = millis;
	parseApiCall(
		"GET",
		"users?limit=2000",
		null,
		function(data)
		{
			for(i = 0; i < data.results.length; i++){
				if(!data.results[i].markerID){
					logInUser(data.results[i].username, makeMarkerFromZipWithOutRegistering);
				}else{
					alert(data.results[i].markerID);
					alert(JSON.stringify(data.results[i]));
				}	
				makeMap();

		}},
		function(data){},
		null);		
}
var makeMarkerFromZipWithOutRegistering = function(creationData){
  parseApiCall("GET", 
    "users/" + creationData.objectId, 
    null, 
    function(data){
      geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {'address':data.zip_code},
          function(results, status){
           if (status == google.maps.GeocoderStatus.OK){
               newLat = results[0].geometry.location.lat() + Math.random();
               newLng = results[0].geometry.location.lng() + Math.random();
              markerParams = {location:
                  {__type:"GeoPoint", 
                  latitude:newLat, 
                  longitude:newLng}, 
                  owner:data.objectId, 
                  content:""};
                  alert("lat: " + markerParams.location.latitude + " lng:" + markerParams.location.longitude);
              newMarkerWithOutRegistering(creationData, markerParams);

            }else{
              alert("Google Maps didn't work | " + status + "\n user registered but no marker added and not added to mailchimp list");
            }
          });
    });
}

function newMarkerWithOutRegistering(userData, markerParams){
  parseApiCall(
  "POST", 
  "classes/markers", 
  markerParams, 
    function(data){
      editUser(
        userData, 
        {markerID:data.objectId},
        function(data){
         alert(JSON.stringify(data));
        });
    }
  );
}

function wait() 
{

var date = new Date();
var curDate = null;

do { curDate = new Date(); } 
while(curDate-date < millis);
} 

//pretty sure this doesn't work and will just delete all the markers
function deleteUnusedMarkers(){
	parseApiCall(
		"GET",
		"classes/markers",
		null,
		function(data){
			alert("Marker " + JSON.stringify(data));
			for(i = 0; i < data.results.length; i++){
				ownerExists = false;
				parseApiCall(
					"GET",
					"users",
					null,
					function(userData){
						alert("USER " + JSON.stringify(userData));
						for(j = 0; j < userData.results.length; j++){
							if(data.results[i].objectId === userData.results[i].markerID){
								ownerExists = true;
							}
						}
						if(!ownerExists){
							parseApiCall(
								"DELETE",
								"classes/markers/" + data.results[i].objectId,
								null,
								function(deleteData){
									alert("Deleted " + data.results[i].objectId);
								},
								function(deleteData){
									alert(JSON.stringify(deleteData));
							});

						}
					},
					function(userData){
						alert(JSON.stringify(userData));
					});
			}
		},
		function(data){
			alert(JSON.stringify(data));
	});
}
