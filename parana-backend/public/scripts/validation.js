/***
 * This module contains all of the functions for validating any sort of input fields.
 *
 * @Author Blake Molina
 */
(function (window) {
  "use strict";
  var App = window.App || {};

  var Validation = {
    /*
     * Validates an email address.
     *
     * @param email The email address to validate.
     */
    isValidEmail: function(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  };

  App.Validation = Validation;
  window.App = App;
})(window);
