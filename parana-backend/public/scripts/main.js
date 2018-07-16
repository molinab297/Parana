(function (window) {
  "use strict";
  var LOGIN_FORM_SELECTOR = "[login-form=\"form\"]";
  var REGISTER_FORM_SELECTOR = "[register-form=\"form\"]";
  var $ = window.jQuery;
  var App = window.App;
  var FormHandler = App.FormHandler;
  var Validation = App.Validation;

  var loginFormHandler = new FormHandler(LOGIN_FORM_SELECTOR);
  var registerFormHandler = new FormHandler(REGISTER_FORM_SELECTOR);

  // If user is already logged in, forward them to the main page
  dpd.users.me(function(user) {
    if (user) {
      location.href = "/welcome.html";
    }
  });

 /*
  * Set-up nice looking animations for when the user clicks on
  * the login and register buttons :-)
  */
  $("#login-form-link").click(function(e) {
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form").fadeOut(100);
    $("#register-form-link").removeClass("active");
    $(this).addClass("active");
    e.preventDefault();
  });
  $("#register-form-link").click(function(e) {
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form").fadeOut(100);
    $("#login-form-link").removeClass("active");
    $(this).addClass("active");
    e.preventDefault();
  });

  // Add input handler for the user login screen to validate the email
  loginFormHandler.addInputHandler(Validation.isValidEmail);

  /*
   * Add a form handler for the user login screen.
   * @param data The form data the was entered by the user.
   */
  loginFormHandler.addSubmitHandler(function (data) {
    // Attemp to login
    dpd.users.login({username: data.emailAddress, password: data.password}, function(session, error) {
      if (error) {
        alert(error.message);
      } else {
        location.href = "/welcome.html";
      }
    });
  });

})(window);
