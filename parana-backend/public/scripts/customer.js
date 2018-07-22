/**
 * Adds an item to the logged-in users cart.
 *
 * @param itemId The UUID of the item
 * @param quantity The amount of the item to add to the cart.
 */
function addToCart(itemId, quantity){
    // Make sure items are available
    dpd.items.get(itemId, function(item, error) {
        if (error){
            console.log(error);
        }
        // Add the item to the users cart if it's in stock.
        else if (quantity <= item.quantity){
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
        // The item isn't in stock.
        else{
            // TODO: Alert user that item isn't in stock.
        }
    });
}

/**
 * Removes an item to the logged-in users cart.
 *
 * @param itemId The UUID of the item
 */
function removeFromCart(itemId){
  dpd.users.me(function(me, err){
      if (!err){
          var cart = me.cart;
          if (cart.length !== 0){
              cart.forEach(function(n){
                  if (n.startsWith(itemId)){
                      dpd.users.put(me.id, {cart: {$pull: n}});
                  }
              });
          } else{
              // TODO: Alert user that cart is empty
              console.log("cannot remove from an empty cart");
          }
      }
  });
}

/**
 * Gets and displays all of the cart data from the current, logged-in user.
 * The cart data in deployd is stored as an array of strings in the
 * format 'itemId:itemQuantity'.
 */
function displayCart(){
    dpd.users.me(function(me, err){
        var cart = me.cart;
        if (cart.length !== 0){
            for (var i = 0; i < cart.length; i++) {

                // Create a new item entry in the list of cart items.
                var item = cart[i].split(':');
                var itemId = item[0];
                var itemQuantity = item[1];
                var ul = document.getElementById("cart-list");
                var li = document.createElement('li');
                li.setAttribute("id", "cart-list-item" + itemId);
                var liPic = document.createElement("img");

                // Get the item image and price from the DB.
                $.ajax({
                    async: false,
                    type: 'GET',
                    url: 'http://localhost:2403/items/' + itemId,
                    success: function(item) {
                        liPic.setAttribute("src", item.image);
                        liPic.setAttribute("style", "width:150px;height:150px;");
                        li.appendChild(liPic);
                        li.appendChild(document.createTextNode("Item Price: $" + item.price + " ------ "));
                    }
                });

                li.appendChild(document.createTextNode("Quantity: " + itemQuantity));
                var button = document.createElement("button");
                button.innerHTML = "remove";
                button.setAttribute("btn-item-id", itemId);

                // When the user clicks the "remove" button next to the item, remove the item from
                // both the database and pop-up window.
                button.onclick = function(event){
                    var itemId = this.getAttribute("btn-item-id");
                    var parent = document.getElementById('cart-list');
                    var value = document.getElementById("cart-list-item" + itemId);
                    removeFromCart(itemId);
                    parent.removeChild(value);
                };

                li.appendChild(button);
                ul.appendChild(li);

            }
        } else{
            // TODO: Alert the user that their cart is empty.
        }
    });
}





// alert(JSON.stringify(me.cart, null, 4));