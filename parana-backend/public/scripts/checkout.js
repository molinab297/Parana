(function (window) {
  "use strict";

	var $ = window.jQuery;
	var App = window.App;


  // shopping cart calculations

	var name = "empty";
	dpd.users.me(function(user) {
		name = user.username;
		console.log(name);	// this ouput prints last
	});
	console.log(name);		// this ouput prints first???


	//	var numItems = 0;
	//	dpd.users.me(function(user) {
	//		numItems = user.cart.length;
	//	});
	// var cartItems = user.cart;
	// for (var i = 0; i < cartItems.length; i++) {
	// 	var item = cartItems[i];
	// 	var itemID = item.substr(0, item.indexOf(':'));
	// 	dpd.items.get(itemID, function (result) {
	// 		var itemName = result.name;
	//
	// 		var itemQuantity = item.substr(item.indexOf(':')+1, item.length);
	// 		var itemHTML = "<li class='list-group-item'>" + itemName + " (" + itemQuantity + ") <span>$3.49</span></li>";
	// 		$('#cart-items-list').append(itemHTML);
	// 	});
	// }
	//
	//
	//
	// var item1 = $('#item-1').text().substr(1);
	// var item2 = $('#item-2').text().substr(1);
	// var taxRate = .0725;
	// var shippingRate = 1.4324;
	//
	// var subtotal = Number(item1) + Number(item2);
	// var shippingCost = shippingRate * numItems;
	// var taxCost = subtotal * taxRate;
	// var total = subtotal + shippingCost + taxCost;
	//
	//$('.cart-num').text(numItems);
	// $('#subtotal').text('$' + subtotal);
	// $('#shipping').text('$' + shippingCost.toFixed(2));
	// $('#tax').text('$' + taxCost.toFixed(2));
	// $('#total').text('$' + total.toFixed(2));



  // show info page functions

  	function showBilling() {
  		$('.billing-page').show();
  		$('.shipping-page').hide();
  		$('.payment-page').hide();
  		$('.billing-heading').css({"text-decoration": "underline"});
  		$('.shipping-heading').css({"text-decoration": "none"});
  		$('.payment-heading').css({"text-decoration": "none"});
  	}

  	function showShipping() {
  		$('.billing-page').hide();
  		$('.shipping-page').show();
  		$('.payment-page').hide();
  		$('.billing-heading').css({"text-decoration": "none"});
  		$('.shipping-heading').css({"text-decoration": "underline"});
  		$('.payment-heading').css({"text-decoration": "none"});
  	}

  	function showPayment() {
  		$('.billing-page').hide();
  		$('.shipping-page').hide();
  		$('.payment-page').show();
  		$('.billing-heading').css({"text-decoration": "none"});
  		$('.shipping-heading').css({"text-decoration": "none"});
  		$('.payment-heading').css({"text-decoration": "underline"});

  	}

  // info page triggers

	showBilling();
	$('.btn-shipping').click(function() {
	  // check if shipping info valid
	  showShipping();
	  // check if shipping address same as billing
	});
	$('.back-to-billing').click(function() {
	  showBilling();
	});
	$('.btn-payment').click(function() {
	  // check if shipping info valid
	  showPayment();
	});
	$('.back-to-shipping').click(function() {
	  showShipping();
	});
	$('.btn-checkout').click(function() {
	  // check if card info is valid
	  // push order to order history
	});

})(window);
