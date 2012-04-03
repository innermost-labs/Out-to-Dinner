var thanks = function(data) {
  // fade out the registration form
  $("#email_reg").fadeOut();
  // fade in the thank you div
}

var registerCallback = function(data) {
  var myObjectId  = data.objectId,
      mySessToken = data.sessionToken;

  $.cookie("otd_sessionToken", mySessToken);
  $.cookie("otd_objectId", myObjectId, { expires: 7 });

  registerForList(data);

  flashMessage("Thank you for signing up!");

  thanks(data);
}

var registerErrorCallback = function(xhr, sts, err) {
  $('#signup').removeClass('disabled');
  flashMessage("Something went wrong. Have you already signed up?", "error");
};

var noUserExists =  function(x, s, err) {
  if (err == "Not Found") {
    flashMessage("No user found with that info", "error");
  }
}