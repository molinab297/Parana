(function (window) {
  "use strict";
  var $ = window.jQuery;

  dpd.users.me(function(user) {
    if (user) {
      $("h1").text("Welcome, " + user.username + "!");
    }
  });

  $("#logout-btn").click(function() {
    dpd.users.logout(function(res, err) {
      location.href = "/";
    });
  });


})(window);
