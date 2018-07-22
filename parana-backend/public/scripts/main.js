(function (window) {
  "use strict";

  var $ = window.jQuery;
  var App = window.App;
  var Customer = App.Customer;
  var customer = new Customer();

  // Write user's email to the welcome message.
  dpd.users.me(function(user) {
    if (user) {
      $("h1").text("Welcome, " + user.username + "!");
    }
  });

    // Load the items from database onto the home page.
    dpd.items.get({}, function(results, error) {
      if (!error){
          var i = 1;
          results.forEach(function(item){
            $("#image" + i).attr('src', item.image);
            $("#item-title-" + i).text(item.name);
            $("#item-price-" + i).text("$" + item.price);
            $("#item-description-" + i).text(item.description);

            /*
             * Add listener to the item name so that the user can click
             * on it to add it to their cart.
             */
            $("#item-title-" + i).click(function(){
                $("#modal-add-cart-title").text("Add " + item.name + " to Cart");
                $("#modal-add-cart-msg").text("Please enter the number of " + item.name + "s you'd like to buy.");
                $("#modal-add-cart").attr('name', item.id);
                $("#modal-add-cart").modal('show');
            });

            i++;
          });
      } else{
        console.log("Error getting items from database");
        console.log(error);
      }
    });



    // Setup listener for the 'My Cart' button
    $("#logout").click(function() {
        dpd.users.logout(function(me, err) {
            location.href = "welcome.html";
        });
    });

    // Setup listener for the 'Logout' button
    $("#my-cart-button").click(function() {
      console.log("here");
            $("#modalAddCartForm").modal('show');
    });


    // Setup listener for when user adds an item to their cart
    // TODO: Make sure the quantity they enter is <= the quantity of the item in database
    // TODO: Make field required.
    $('#modal-add-cart-btn').on('click', function () {
        var quantity = $('#modal-add-cart-quantity').val();
        var itemId = $('#modal-add-cart').attr('name');
        customer.addToCart(itemId, quantity);
        $("#modal-add-cart").modal('hide');
    });


})(window);
