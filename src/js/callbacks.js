var thanks = function(data) {
    $("#email_reg").fadeOut(function() {
      $("#thanks").fadeIn();
    });
}

var registerCallback = function(data) {
  var myObjectId  = data.objectId,
      mySessToken = data.sessionToken;

  $.cookie("otd_sessionToken", mySessToken);
  // $.cookie("otd_objectId", myObjectId, { expires: 7 });

  registerForList(data);

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
