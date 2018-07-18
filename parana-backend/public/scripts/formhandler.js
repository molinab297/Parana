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
    console.log("Setting submit handler for form");
    this.$formElement.on("submit", function (event) {
      event.preventDefault();

      var data = {};
      $(this).serializeArray().forEach(function (item) {
        data[item.name] = item.value;
        console.log(item.name + " is " + item.value);
      });

      console.log(data);
      fn(data);
    });
  };

  /*
   * This method adds an input handler for a single input field in the form. For example,
   * each time the user modifies the Email field within the form, they should be notified
   * if the email they just entered is a valid email address.
   *
   * TODO: Need to make this more generic to accept any selector.
   *
   * @param fn The validation method to apply on the text input by the user.
   */
  FormHandler.prototype.addInputHandler = function(fn){
    console.log("Setting input handler for form");
    // Add event handler for when user inputs data into the Email field
    this.$formElement.on("input", "[name=\"emailAddress\"]", function (event){
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
