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
    var url = "http://signup.outtodinner.org/?u=" + data.objectId
    ,   dataIn = $.param({first_name:userData.first_name, email:userData.email, url:url});

    apiCall("POST", 
      "src/mailchimpsubscribe.php", 
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

var volunteerUserAs = function(type, value) {
  var dataIn = {}
  ,   types = ["guest","host","super"];
  
  if (types.indexOf(type)) {
    dataIn[type] = (value === "true");
  }

  var url = "users/" + $.cookie("otd_objectId");
  parseApiCallWithErrorHandling("PUT", url, dataIn, volunteerCallback(type, value),
  volunteerErrorCallback(type, value), $.cookie("otd_sessionToken"));
};

var volunteerCallback = function(type, value) {
  var cb = function(data) {
    var newVal = (value === "false");
    $('input[name=' + type + ']')[0].setAttribute('value', newVal);
    $($('#' + type + 'button')[0]).toggleClass("on", !newVal);
    if (!newVal) 
      flashMessage('Thanks! We will be in touch shortly.', 'info');
  }
  return cb;
}

var volunteerErrorCallback = function(type, value) {
  var cb = function(x, s, err) {
    flashMessage("There was an error. Please try again later!", "error");
  }
  return cb;
}

var logInUser = function(email) {
  var dataIn = $.param({username:email, password:"temp"});
  parseApiCallWithErrorHandling("GET", "login", dataIn, function(data) {
    $.cookie("otd_sessionToken", data.sessionToken);
    showMap(data);
  }, function(xhr, sts, err) {
    flashMessage("Login failed", "error");
  });
};
