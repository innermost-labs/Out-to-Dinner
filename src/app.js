// Keep our user information around
var myObjectId
,   mySessToken;

var getUrlParameter = function(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results == null) return "";
  else return results[1];
}

var flashMessage = function(messageText, cssClass) {
  var cssClass = cssClass || "info",
      notice = "";

  notice += "<p class=\"" + cssClass + "\">";
  notice += messageText;
  notice += "</p>";
  $('#messages').append(notice);
  //TODO make message fade out after 5 seconds
}

var showMap = function(data) {
  $('#email_reg').hide();
  $('#dashboard').show();
  makeMap(data.objectId, data.sessionToken, data.markerId);
}

// App runtime js goes here
$(document).ready(function() {
  var emailCookie = $.cookie("otd_email")
  ,   userParam   = getUrlParameter("u")
  ,   mapToggle   = getUrlParameter("map");

  // Login the user if cookie or urlparam
  if (emailCookie) { 
    logInUser(emailCookie);
  } else if (userParam) {
    logInUser(emailFromId(userParam));
  }
});
