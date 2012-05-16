var thanks = function(data) {
    $("#email_reg").fadeOut(function() {
      $("#thanks").fadeIn();
      $("body").addClass("thanks");
    });
}

var registerCallback = function(data) {
  var myObjectId  = data.objectId,
      mySessToken = data.sessionToken;
  $.cookie("otd_sessionToken", mySessToken);
  // $.cookie("otd_objectId", myObjectId, { expires: 7 });
  alert("In registerCallback");
  registerForList(data);
  
  thanks(data);
}

var registerErrorCallback = function(xhr, sts, err) {
  $('#signup').removeClass('disabled');
  flashMessage("Are you sure you filled out the form correctly?", "error");
};

var noUserExists =  function(x, s, err) {
  if (err == "Not Found") {
    flashMessage("No user found with that info", "error");
  }
}
