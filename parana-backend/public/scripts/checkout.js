(function (window) {
  "use strict";

	var $ = window.jQuery;
	var App = window.App;


  // shopping cart calculations

	const taxRate = .0725;				// CA tax rate
	const shippingRate = 1.4324;		// flat shipping cost per item

	dpd.users.me(function(user) {

		var subTotal = 0;
		var shippingCost = 0;

		var cartItems = user.cart;
		cartItems.forEach(function(item) {

			// split "itemID:quantity:name:price"
			var itemElems = item.split(":");
			var itemQuantity = itemElems[1];
			var itemName = itemElems[2];
			var itemPrice = itemQuantity * itemElems[3];

			// show item cost on checkout page
			var itemHTML = "<li class='list-group-item'>" + itemName + " (" +
				itemQuantity + ") <span>$" + itemPrice.toFixed(2) +"</span></li>";
			$('#cart-items-list').append(itemHTML);

			subTotal += Number(itemPrice);
			shippingCost += shippingRate * itemQuantity;
		});

		// calculate cart costs
		var numItems = cartItems.length;
		var taxCost = subTotal * taxRate;
		var total = subTotal + shippingCost + taxCost;

		// display cart costs
		$('.cart-num').text(numItems);
		$('#subtotal').text('$' + subTotal.toFixed(2));
		$('#shipping').text('$' + shippingCost.toFixed(2));
		$('#tax').text('$' + taxCost.toFixed(2));
		$('#total').text('$' + total.toFixed(2));
	});

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
