(function (window) {
  "use strict";

  // shopping cart calculations

  	var $ = window.jQuery;

  	var numItems = 2;
  	var item1 = $('#item-1').text().substr(1);
  	var item2 = $('#item-2').text().substr(1);
  	var taxRate = .0725;
  	var shippingRate = 1.4324;

  	var subtotal = Number(item1) + Number(item2);
  	var shippingCost = shippingRate * numItems;
  	var taxCost = subtotal * taxRate;
  	var total = subtotal + shippingCost + taxCost;

  	$('.cart-num').text(numItems);
  	$('#subtotal').text('$' + subtotal);
  	$('#shipping').text('$' + shippingCost.toFixed(2));
  	$('#tax').text('$' + taxCost.toFixed(2));
  	$('#total').text('$' + total.toFixed(2));

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
  		// send email?
  	});

})(window);
