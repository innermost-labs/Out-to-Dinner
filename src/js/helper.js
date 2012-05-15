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

  message = document.createElement("p");
  $(message).addClass(cssClass);
  message.innerHTML = messageText;
  $('#messages').append(message);
  $(message).delay(5000).slideUp();
}

// var showMap = function(data) {
//   $('#email_reg').hide();
//   $('#dashboard').show();
//   makeMap(data.objectId, data.sessionToken, data.markerId);
// }

