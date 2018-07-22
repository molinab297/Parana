(function (window) {
  "use strict";

  var $ = window.jQuery;
  var App = window.App;

  // Write user's email to the welcome message.
  dpd.users.me(function(user) {
    if (user) {
      $("h1").text("Welcome, " + user.username + "!");
    }
  });

    // Load the items from database onto the home page.
    dpd.items.get(function(results, error) {
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
                $("#modal-add-cart-msg").text("Please enter the quantity");
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



    // Setup listener for the 'Logout' button
    $("#logout-btn").click(function() {
        dpd.users.logout(function(me, err) {
            location.href = "welcome.html";
        });
    });

    // Setup listener for the 'My Cart' button
    $("#my-cart-button").click(function(e) {
        displayCart();
        $("#modal-view-cart").modal('show');
    });

    // Setup listener for the 'Done' button when viewing the cart
    $('#modal-view-cart-btn').on('click', function () {
        $("#modal-view-cart").modal('hide');
        $("#cart-list").empty();
    });

    // Clear the cart if the user clicks off of the modal
    $('#modal-view-cart').on('hidden.bs.modal', function () {
        $("#cart-list").empty();
    });


    // Setup listener for when user adds an item to their cart
    // TODO: Make field required.
    $('#modal-add-cart-btn').on('click', function () {
        var quantity = $('#modal-add-cart-quantity').val();
        var itemId = $('#modal-add-cart').attr('name');
        addToCart(itemId, quantity);
        $("#modal-add-cart").modal('hide');
    });

    // Setup listener for when user searches for item using the search bar.
    $('#search-bar').on('keyup', function (e) {
        if (e.keyCode === 13) {
            var query = $('#search-bar').val();
            dpd.items.get({name: query}, function(result, err){
               if (!err){
                   if (result.length !== 0){
                       var item = result[0];
                       $("#modal-item-search-title").text(query);
                       $("#modal-item-search-pic").attr('src', item.image);
                       $("#modal-item-search-pic").attr('style', "width:300px;height:300px;");
                       $("#modal-item-search-description").text(item.description);
                       $("#modal-item-search-price").text("$" + item.price);
                       $("#modal-item-search-quantity").text(item.quantity);

                       // When user adds an item to their cart using the search feature.
                       $("#modal-item-search-add-btn").on('click', function(){
                           var quantity = $("#modal-item-amount").val();
                           addToCart(item.id, quantity);
                           $("#modal-item-search").modal('hide');
                       });

                       $("#modal-item-search").modal('show');
                   } else{
                       $("#generic-modal-title").text('Could not find item!');
                       $("#generic-modal-body").text('Your search \"' + query + "\" did not match any products.");
                       $("#generic-modal").modal('show');
                   }
               } else{
                   console.log(err);
               }
            });
            $('#search-bar').val('');
        }
    });


})(window);
