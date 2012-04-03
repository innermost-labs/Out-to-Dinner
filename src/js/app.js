// Keep our user information around
var myObjectId
,   mySessToken;

// App runtime js goes here
$(document).ready(function() {
  var objectIdCookie = $.cookie("otd_objectId")
  ,   userParam   = getUrlParameter("u")
  ,   mapToggle   = getUrlParameter("map");

  objectId = objectIdCookie || userParam;

  // Login the user if cookie or urlparam
  if (objectId) { 
    // See if user exists in Parse
    withUserFromId(objectId, function(data) {
      logInUser(data.email, thanks(data))
    });
  // Otherwise, show the public map if map param in url
  } else if(getUrlParameter("map")) {
    showMap();
  }
});
