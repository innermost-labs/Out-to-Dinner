var onError = function(xhr, sts, err) {
  flashMessage(err, "error");
};

var apiCall = function(verb, uri, headers, data, callback, error) {
  var error = error || onError
  ,   dataIn = data;
  
  if ((["PUT","POST"].indexOf(verb) != -1) && !(uri.toLowerCase() == "src/mailchimpsubscribe.php")) {
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
    var url = "http://outtodinner.org/?u=" + data.objectId
    ,   dataIn = $.param({first_name:userData.first_name, email:userData.email, url:url});

    apiCall("POST", 
      "src/mailchimpsubscribe.php", 
      {"Content-type":"application/x-www-form-urlencoded"},
      dataIn, 
      function(data) {},
      onError);
  }, function() {})
};

var registerUser = function(user) {
  $('#signup').addClass('disabled');
  var dataIn = {
    "username": user.email,
    "first_name": user.first,
    "password": "temp",
    "email": user.email,
    "markerID": null,
    "awesome": false,
    "host": false,
    "guest": false,
  };
  parseApiCallWithErrorHandling("POST", "users", dataIn, registerHandler, registerErrorHandler);
}


var withUserFromId = function(objectId, callback, errorCallback) {
  parseApiCallWithErrorHandling("GET", "users/" + objectId, {}, callback, errorCallback);
}

var registerHandler = function(data) {
  var myObjectId = data.objectId,
      mySessToken = data.sessionToken;

  $.cookie("otd_sessionToken", mySessToken);
  $.cookie("otd_objectId", myObjectId, { expires: 7 });

  registerForList(data);

  flashMessage("Thank you for signing up!");

  showMap(data);
}

var registerErrorHandler = function(xhr, sts, err) {
  $('#signup').removeClass('disabled');
  flashMessage("Something went wrong. Have you already signed up?", "error");
};

var volunteerUserAs = function(type, form) {
  var dataIn = {}
  ,   types = ["guest","host","awesome"];
  
  if (types.indexOf(type)) {
    dataIn[type] = true;
  }
  var url = "users/" + $.cookie("otd_objectId");
  parseApiCall("PUT", url, dataIn, volunteerCallback,
  volunteerErrorCallback, $.cookie("otd_sessionToken"));
};

var volunteerCallback = function(data) {
  //TODO toggle button based on choice
  //TODO show flash message based on choice
}

var volunteerErrorCallback = function() {
  alert("Sorry, something went wrong...");
}

var logInUser = function(email) {
  var dataIn = $.param({username:email, password:"temp"});
  parseApiCallWithErrorHandling("GET", "login", dataIn, function(data) {
    showMap(data);
  }, function(xhr, sts, err) {
    flashMessage("Login failed", "error");
  });
};
