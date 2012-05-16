var onError = function(xhr, sts, err) {
  flashMessage(err, "error");
};

var apiCall = function(verb, uri, headers, data, callback, error) {
  var error = error || onError
  ,   dataIn = data;
  
  if ((["PUT","POST"].indexOf(verb) != -1) && !(uri.toLowerCase() == "src/php/mailchimpsubscribe.php")) {
    dataIn = JSON.stringify(dataIn);
  }

  var params = {
    type: verb,
    url: uri,
    headers: headers,
    contentType: "application/json",
    data: dataIn,
    crossDomain: true,
    error: function (xhr, textStatus, errorThrown) {
      error(xhr, textStatus, errorThrown);
    },
    success: function (data) {
              //alert(JSON.stringify(data));
               callback(data);
             }
  }

  $.ajax(params);
};

var parseApiCallWithErrorHandling = function(verb, path, data, callback, errorCallback, session) {
  var headers = {
    //TODO config object from api_keys.js
    "X-Parse-Application-Id": "oEhx7MD4NJ9dmwOTJVYIsDtSPRwxYYlXSwm13dI3",
    "X-Parse-REST-API-Key": "jd6bIkiEcWb89gHyQUuMYhst6d6hkWkcB3ySWzUv",
  };
  var uri = "https://api.parse.com/1/" + path;

  if (session) {
    headers["X-Parse-Session-Token"] = session;
  }

  apiCall(verb, uri, headers, data, callback, errorCallback);
}

var parseApiCall = function(verb, path, data, callback) {
  parseApiCallWithErrorHandling(verb, path, data, callback, onError);
}

// registers the user for the email list, and gives them a unique URL.
var registerForList = function(data) {
  withUserFromId(data.objectId, function(userData) {
    var url = "http://signup.outtodinner.org/?u=" + data.objectId
    ,   dataIn = $.param({first_name:userData.first_name,
                          last_name: userData.last_name,
                          zip_code:  userData.zip_code,
                          email:     userData.email,
                          lgbt:      userData.lgbt,
                          ally:      userData.ally, 
                          url:       url,
						  refer:	 userData.refer});
    apiCall("POST", 
      "src/php/mailchimpsubscribe.php", 
      {"Content-type":"application/x-www-form-urlencoded"},
      dataIn, 
      function(data) {},
      function(x, s, e) {});
  }, function() {})
};

var registerUser = function(user) {
  $('#signup').addClass('disabled');
  
  var dataIn = {
    "username": user.email,
    "first_name": user.first,
    "last_name": user.last,
    "zip_code": user.zip,
    "password": "temp",
    "email": user.email,
    "lgbt": user.lgbt,
    "ally": user.ally,
	"refer": user.refer
  }
  parseApiCallWithErrorHandling("POST", "users", dataIn, makeMarkerFromZip, registerErrorCallback);
  //without adding marker
  //parseApiCallWithErrorHandling("POST", "users", dataIn, registerCallback, registerErrorCallback);
}


var withUserFromId = function(objectId, callback, errorCallback) {
  parseApiCallWithErrorHandling("GET", "users/" + objectId, {}, callback, errorCallback);
}

var volunteerUserAs = function(type, value) {
  var dataIn = {}
  ,   types = ["guest","host"];
  
  if (types.indexOf(type)) {
    dataIn[type] = (value === "true");
  }

  var url = "users/" + $.cookie("otd_objectId");
  parseApiCallWithErrorHandling("PUT", url, dataIn, volunteerCallback(type, value),
  volunteerErrorCallback(type, value), $.cookie("otd_sessionToken"));
};

var logInUser = function(email, callback) {
  var dataIn = $.param({username:email, password:"temp"});
  parseApiCallWithErrorHandling("GET", "login", dataIn, function(data) {
    $.cookie("otd_sessionToken", data.sessionToken);
    callback(data);
  }, noUserExists);
};



//finds the lat and long of the zip code for the user then calls newMarker to 
var makeMarkerFromZip = function(creationData){
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
                  //alert("lat: " + markerParams.location.latitude + " lng:" + markerParams.location.longitude);
              newMarker(creationData, markerParams);

            }else{
              alert("Google Maps didn't work | " + status + "\n user registered but no marker added and not added to mailchimp list");
            }
          });
    });
}

//Makes a new marker, which only happens when the user registers. Then it edits the user so she has the marker ID
function newMarker(userData, markerParams){
  parseApiCall(
	"POST", 
  "classes/markers", 
  markerParams, 
    function(data){
      editUser(
        userData, 
        {markerID:data.objectId},
        function(data){
          registerCallback(userData);
        });
    }
  );
}

//adds the json in changed data to the user then calls the continuation with the resulting data (right now, only using registerCallback, cause I was getting errors earlier)
var editUser =  function(userData, changedData, continuation){
  //alert("USERDATA: " + JSON.stringify(userData) + " CHANGEDDDATA: " + JSON.stringify(changedData));
  parseApiCallWithErrorHandling(
    "PUT",
    "users/" + userData.objectId,
	  changedData,
    continuation,
    registerErrorCallback,
    userData.sessionToken
    );
}

