(function (window) {
  "use strict";
  const $ = window.jQuery;

  dpd.users.me(function(user) {
    if (user) {
      $("h1").text("Welcome, " + user.username + "!");
    }
  });

  $("#logout-btn").click(function() {
    dpd.users.logout(function(res, err) {
      location.href = "/";
    });
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


})(window);
