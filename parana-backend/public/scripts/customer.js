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
        // Make sure the item is in stock
        else if (item.quantity <= 0){
            $("#generic-modal-title").text('Out of Stock!');
            $("#generic-modal-body").text("Sorry about that... we're currently out of stock of that item.");
            $("#generic-modal").modal('show');
        }
        // Make sure there is enough of the item to add to the user's cart
        else if (quantity > item.quantity){
            $("#generic-modal-title").text('Not Enough!');
            $("#generic-modal-body").text("We're sorry, but we currently don't have " + quantity + " of those.");
            $("#generic-modal").modal('show');
        }
        // Add the item to the user's cart
        else{
            console.log("Adding item with id: \"" + itemId + "\" to cart");
            dpd.users.me(function(me, err){
				// cart string = "itemID:quantity:name:price"
                dpd.users.put(me.id, {cart: {$push: itemId + ":" + quantity + ":" + item.name + ":" + item.price} }, function(result, err){
                    if (err){
                        console.log(err);
                    } else {
                        console.log("Updated cart:");
                        console.log(result);

                        // Update the Items Collection
                        var itemsRemaining = item.quantity - quantity;
                        dpd.items.put(item.id, {quantity: itemsRemaining});
                    }
                })
            });
        }
    });
}

/**
 * Removes an item to the logged-in users cart.
 *
 * TODO: Removing an item removes all entries with the same item id.
 *
 * @param itemId The UUID of the item
 */
function removeFromCart(itemId){
  dpd.users.me(function(me, err){
      if (!err){
          const cart = me.cart;
          for (var i = 0; i < cart.length; i++){

              // Parse data retrieved from database.
              var cartItem = cart[i].split(':');
              var cartItemId = cartItem[0];
              var cartItemQuantity = cartItem[1];

              // If the item id was found in the user's cart, remove it
              // and update the items quantity in the database.
              if (itemId === cartItemId){
                  dpd.users.put(me.id, {cart: {$pull: cart[i]}});
                  // Update the Items Collection
                  dpd.items.get(itemId, function(item, err){
                      if (!err){
                          var newAmmount = item.quantity + parseInt(cartItemQuantity, 10);
                          dpd.items.put(item.id, {quantity: newAmmount});
                      }
                  });
              }
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
            $('#empty-cart-msg').show();
        }
    });
}

/**
 * Gets and displays all of the order history data matching the id of the logged-in user.
 */
function displayOrderHistory(){
    dpd.users.me(function(me, err){
        if (!err) {
            dpd.orders.get({"userId":me.id}, function (orders) {
                if (orders.length !== 0) {
                    for (var i = 0; i < orders.length; i++) {
                        var order = orders[i];
                        var orderId = order.id;
                        var orderDate = order.date;
                        var orderTotalCost = order.totalCost;

                        // Create order date entry
                        var ul = document.getElementById("order-list");
                        var li = document.createElement('li');
                        li.setAttribute("id", "order-list-order" + orderId + "-date");
                        li.appendChild(document.createTextNode("Order "+ (i+1) + " (" + orderDate + ")"));
                        ul.appendChild(li);

                        for (var j = 0; j < order.itemIDs.length; j++) {
                            // Create new item entry
                            var itemId = order.itemIDs[j];
                            var itemName = order.itemNames[j];
                            var itemPrice = order.itemPrices[j];
                            var itemQty = order.itemQuantities[j];
                            var ul = document.getElementById("order-list");
                            var li = document.createElement('li');
                            li.setAttribute("id", "order-list-item" + itemId);
                            li.appendChild(document.createTextNode("Item Name: " + itemName + " ------ "));
                            li.appendChild(document.createTextNode("Price: $" + itemPrice + " ------ "));
                            li.appendChild(document.createTextNode("Qty: " + itemQty));

                            ul.appendChild(li);
                        }

                        // Create order total cost entry
                        var ul = document.getElementById("order-list");
                        var li = document.createElement('li');
                        li.setAttribute("id", "order-list-order" + orderId + "-total");
                        li.appendChild(document.createTextNode("Total Cost: $" + orderTotalCost.toFixed(2)));
                        ul.appendChild(li);

                        var hr = document.createElement("hr");
                        ul.appendChild(hr);
                    }
                } else {
                    $('#empty-order-history-msg').show();
                }
            });
        } else {
            console.log(err);
        }
    });
}



// alert(JSON.stringify(me.cart, null, 4));
