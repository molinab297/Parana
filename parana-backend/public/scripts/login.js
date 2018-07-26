/***
 * This module contains all of the logic for the login/register page.
 *
 * @Author Blake Molina
 * @Date 7/26/18
 */
(function (window) {
  "use strict";

  // Variable declarations go here
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
      location.href = "/index.html";
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

  // Add input handler for the login screen to validate the email
  loginFormHandler.addInputHandler(Validation.isValidEmail, "[name=\"emailAddress\"]");
  // Add input handler for the register screen to validate the email
  registerFormHandler.addInputHandler(Validation.isValidEmail, "[name=\"emailAddress\"]");

  /*
   * Add a form handler for the login page.
   *
   * @param data The form data the was entered by the user. This data contains
   *             the email address and password that the user entered.
   */
  loginFormHandler.addSubmitHandler(function (data) {
    login(data);
  });

  /*
   * Attempts to authenticate and login the user.
   *
   * @param credentials An object containing the users credentials (the username and password).
   */
  var login = function(credentials) {
    dpd.users.login({username: credentials.emailAddress, password: credentials.password}, function(session, error) {
      if (error) {
        alert(error.message);
      } else {
        location.href = "/index.html";
      }
    });
  };

  /*
   * Add a form handler for the register page.
   *
   * @param data The form data the was entered by the user. This data contains
   *             the new email address and password that the user entered.
   */
  registerFormHandler.addSubmitHandler(function (data) {
    // Make sure user entered the same password twice.
    if ($("#new-password").val() !== $("#confirm-password").val()){
      $("#register-account-popup-msg").text("Passwords do not match!");
      $("#register-account-popup").modal({});
    } else {
      // Attemp to register the new account.
      dpd.users.post({username: data.emailAddress, password: data.password}).then(function(newAccount) {
        console.log("Created new account: " + newAccount);
        login(data);
      },
      // Error encountered
      function(err) {
        if (err.errors["username"] === "is already in use"){
          $("#register-account-popup-msg").text("An account with this email already exists!");
          $("#register-account-popup").modal({});
        } else {
          $("#register-account-popup-msg").text("An unknown error occured while trying to create the account.");
          $("#register-account-popup").modal({});
        }
      });
    }
  });

})(window);
