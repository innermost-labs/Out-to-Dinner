// Keep our user information around
var myObjectId
,   mySessToken;

// App runtime js goes here
$(document).ready(function() {
  var objectIdCookie = $.cookie("otd_objectId")
  ,   userParam   = getUrlParameter("u")
  ,   mapToggle   = getUrlParameter("map");

  // Login the user if cookie or urlparam
  if (userParam) { 
    withUserFromId(userParam, function(data) {
      logInUser(data.email, thanks(data))
    });
  }
});
