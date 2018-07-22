(function (window) {
    "use strict";
    var App = window.App || {};
    var $ = window.jQuery;

    // Constructor
    function Customer() {}

    Customer.prototype.addToCart = function(itemId, quantity){
        console.log("Adding item with id: \"" + itemId + "\" to cart");
        dpd.users.me(function(me, err){
            dpd.users.put(me.id, {cart: {$push: itemId + ":" + quantity} }, function(result, err){
                if (err){
                    console.log(err);
                } else {
                    console.log("Updated cart:");
                    console.log(result);
                }
            })
        });
    }

    Customer.prototype.removeFromCart = function(item){
        console.log("Item being removed from cart: " + item);
    }


    App.Customer = Customer;
    window.App = App;
})(window);
