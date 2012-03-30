// Keep our user information around
var myObjectId
,   mySessToken;

// App runtime js goes here
$(document).ready(function() {
  var emailCookie = $.cookie("otd_email")
  ,   userParam   = getUrlParameter("u")
  ,   mapToggle   = getUrlParameter("map");

  // Login the user if cookie or urlparam
  if (emailCookie) { 
    logInUser(emailCookie);
  } else if (userParam) {
    if (var email = getEmailFromId(userParam)) {
      logInUser(email);
    }
  // Otherwise, show the public map if map param in url
  } else if(getUrlParameter("map")) {
    showMap();
  }
});
