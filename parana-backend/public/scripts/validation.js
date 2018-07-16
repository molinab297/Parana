(function (window) {
  "use strict";
  var App = window.App || {};

  var Validation = {
    // Validates whether or not an email has a valid email address format.
    isValidEmail: function(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  };

  App.Validation = Validation;
  window.App = App;

})(window);
