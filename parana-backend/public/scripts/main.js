(function (window) {
  "use strict";
  const $ = window.jQuery;

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
        dpd.users.me(function(me, err) {
            console.log("unimplemented");
        });
    });


})(window);
