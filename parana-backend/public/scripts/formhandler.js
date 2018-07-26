/***
 * This module contains a helper class for handling forms. To validate a form,
 * call the addSubmitHandler function and pass in a callback function that'll be performed
 * on the input data by the user after it's validated.
 *
 * @Author Animesh Chaudhry
 * @Date 7/26/18
 */
(function (window) {
  "use strict";
  var App = window.App || {};
  var $ = window.jQuery;

  /*
   * The Constructor that sets the selector.
   *
   * @param selector The selector to select HTML elements and perform actions on them.
   */
  function FormHandler(selector) {
    if (!selector) {
      throw new Error("No selector provided");
    }
    this.$formElement = $(selector);
    if (this.$formElement.length === 0) {
      throw new Error("Could not find element with selector: " + selector);
    }
  }

  /*
   * This method adds a submit handler for a form.
   *
   * @param fn The function to apply on the form data after it gets submitted.
   */
  FormHandler.prototype.addSubmitHandler = function (fn) {
    this.$formElement.on("submit", function (event) {
      event.preventDefault();

      var data = {};
      $(this).serializeArray().forEach(function (item) {
        data[item.name] = item.value;
      });
      fn(data);
    });
  };

  /*
   * This method adds an input handler for a single input field in the form. For example,
   * each time the user modifies the Email field within the form, they should be notified
   * if the email they just entered is a valid email address.
   *
   *
   * @param fn The validation method to apply on the text input by the user.
   */
  FormHandler.prototype.addInputHandler = function(fn, selector){
    // Add event handler for when user inputs data into the Email field
    this.$formElement.on("input", selector, function (event){
      var emailAddress = event.target.value;
      var message = "";
      if (fn(emailAddress)){
        event.target.setCustomValidity("");
      } else{
        message = emailAddress + " is not an authorized email address!";
        event.target.setCustomValidity(message);
      }
    });
  };

  App.FormHandler = FormHandler;
  window.App = App;
})(window);
