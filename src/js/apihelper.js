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
                          url:       url});
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
    "ally": user.ally
  }
  parseApiCallWithErrorHandling("POST", "users", dataIn, registerCallback, registerErrorCallback);
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
