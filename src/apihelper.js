var onError = function(xhr, sts, err) {
  flashMessage(err, "error");
};

var apiCall = function(verb, uri, headers, data, callback, error) {
  error = error || onError;

  var params = {
    type: verb,
    url: uri,
    headers: headers,
    contentType: "application/json",
    data: JSON.stringify(data),
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

var parseApiCall = function(verb, path, data, callback, session) {
  var headers = {
    //TODO config object from api_keys.js
    "X-Parse-Application-Id": "oEhx7MD4NJ9dmwOTJVYIsDtSPRwxYYlXSwm13dI3",
    "X-Parse-REST-API-Key": "jd6bIkiEcWb89gHyQUuMYhst6d6hkWkcB3ySWzUv",
  };
  var uri = "https://api.parse.com/1/" + path;

  if (session) {
    headers["X-Parse-Session-Token"] = session;
  }

  apiCall(verb, uri, headers, data, callback);
}

// registers the user for the email list, and gives them a unique URL.
var registerForList = function(email, uurl){
  var dataIn = $.param({email:email, MERGE3:uurl});
  apiCall("POST", 
    "src/mailchimpsubscribe.php", 
    {"Content-type":"application/x-www-form-urlencoded"},
    dataIn, 
    function(data) { 
      flashMessage("Thank you for signing up!");
    },
    registerErrorHandler);
};

var registerUser = function(user) {
  $('#signup').addClass('disabled');
  var dataIn = {
    "username": user.email,
    "first_name": user.first,
    "password": "temp",
    "email": user.email,
    "markerID": null,
    "volunteer": false,
    "host": false,
    "guest": false,
  };
  parseApiCall("POST", "users", dataIn, registerHandler);
}


var getEmailFromId = function(objectId) {
  var email = false;

  parseApiCall("GET", "users/" + objectId, {}, function(data) {
    email = data.email;
  });

  return email;
}

var registerHandler = function(data) {
  var myObjectId = data.objectId,
      mySessToken = data.sessionToken,
      email = data.Email;
  
  $.cookie("otd_email", email);
  $.cookie("otd_objectId", myObjectId);
  $.cookie("otd_sessionToken", mySessToken);
  registerForList(email, "http://outtodinner.org/?u=" + myObjectId);

  showMap(data);
}

var registerErrorHandler = function(xhr, sts, err) {
  $('#signup').removeClass('disabled');
  flashMessage("Something went wrong. Have you already signed up?", "error");
};

var volunteerUserAs = function(type, form) {
  var userInput = form.value
  ,   dataIn = {}
  ,   types = ["guest","host","awesome"]

  if (types.indexOf(type)) {
    dataIn[type] = type;
  }

  parseApiCall("PUT", myObjectId, dataIn, volunteerCallback,
  volunteerErrorCallback, mySessionToken);
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
  parseApiCall("GET", "login", dataIn, function(data) {
    showMap(data);
  });
};
