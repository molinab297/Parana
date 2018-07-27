/***
 * This module contains all the front-end logic and validation for the checkout
 * page. It calculates the user's total cart and checks the payment forms for
 * valid information. When checkout is done, the order is saved and returns the
 * user to the home page.
 *
 * @Author: Timothy Nguyen
 * @Date: 7/26/18
 */

(function (window) {
  "use strict";

	var $ = window.jQuery;
	var App = window.App;


  // Shopping cart calculations to display on right checkout bar

	const taxRate = .0725;				// CA tax rate
	const shippingRate = 1.4324;		// flat shipping cost per item

	dpd.users.me(function(user) {

		var subTotal = 0;
		var shippingCost = 0;

		// iterate  through item in cart
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



  // info page triggers

	showBilling();
	$('.btn-shipping').click(function() {
	  // if (billingIsValid()) {
		//   checkSameAddress();
		  showShipping();
	  // } else {
		//   $('#validation-msg').fadeIn(75).fadeOut(75).fadeIn(75);
	  // }
	});


	$('.back-to-billing').click(function() {
		// $('#validation-msg').hide();
		showBilling();
	});


	$('.btn-payment').click(function() {
	  // if (shippingIsValid()) {
		  showPayment();
	  // } else {
		//   $('#validation-msg').fadeIn(75).fadeOut(75).fadeIn(75);
	  // }
	});


	$('.back-to-shipping').click(function() {
		// $('#validation-msg').hide();
		showShipping();
	});


	$('.btn-checkout').click(function() {
	  // if (paymentIsValid()) {
		  // after successful checkout, store order history and empty cart
		  saveOrderHistory();
		  emptyCart();

		  alert("Order Successful!");
		  window.location.href = "index.html";
	  // } else {
		//   $('#validation-msg').fadeIn(75).fadeOut(75).fadeIn(75);
	  // }
	});

// main checkout form trigger functions

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

	// save order history in database
	function saveOrderHistory() {
		// get current user's info
		dpd.users.me(function(user) {
			// item details for order history
			var itemIdArr = [];
			var itemNameArr = [];
			var itemPriceArr = [];
			var itemQuantitiesArr = [];

			var subTotal = 0;
			var shippingCost = 0;

			// iterate  through item in cart
			var cartItems = user.cart;
			cartItems.forEach(function(item) {
				// split "itemID:quantity:name:price"
				var itemElems = item.split(":");
				var itemID = itemElems[0];
				var itemQuantity = itemElems[1];
				var itemName = itemElems[2];
				var itemPrice = itemQuantity * itemElems[3];
				// add item details to order history
				itemIdArr.push(itemID);
				itemNameArr.push(itemName);
				itemPriceArr.push(itemPrice);
				itemQuantitiesArr.push(itemQuantity);

				subTotal += Number(itemPrice);
				shippingCost += shippingRate * itemQuantity;
			});
			// calculate total cart cost
			var numItems = cartItems.length;
			var taxCost = subTotal * taxRate;
			var total = subTotal + shippingCost + taxCost;

			var orderDate = new Date();
			var userID = user.id;
			// insert all data to order collection
			dpd.orders.post({"userId":userID, "date":orderDate, "itemIDs":itemIdArr,
			"itemNames":itemNameArr, "itemPrices":itemPriceArr,
			"itemQuantities":itemQuantitiesArr,"totalCost":total},
			function(result, err) {
				if(err) return console.log(err);
				console.log(result, result.id);
			});
		});
	}

	// remove all items from current user's cart
	function emptyCart() {
		// get current user's info
		dpd.users.me(function(user){
			dpd.users.put(user.id, {cart: []});
		});
	}

	function billingIsValid () {
		// get input from billing form
		var firstName = $('#first-name').val();
		var lastName = $('#last-name').val();
		var address = $('#billing-address').val();
		var city = $('#billing-city').val();
		var zipCode = $('#billing-zip-code').val();
		var state = $('#billing-state').val();
		var country = $('#billing-country').val();

		// billing regex patterns
		var namePatt = /^[A-Z][a-z]+$/;
		var addressPatt = /^[0-9]+\ [A-Za-z\  \.]+$/;
		var cityPatt = /^[A-Z][a-z\ \.]+$/;
		var zipPatt = /^[0-9]{5}$/;

		// display message if form is invalid
		if (!namePatt.test(firstName)) {
		  $('#validation-msg').text("Invalid First Name");
		} else if (!namePatt.test(lastName)) {
		  $('#validation-msg').text("Invalid Last Name");
		} else if (!addressPatt.test(address)) {
		  $('#validation-msg').text("Invalid Address");
		} else if (!cityPatt.test(city)) {
		  $('#validation-msg').text("Invalid City");
		} else if (!zipPatt.test(zipCode)) {
		  $('#validation-msg').text("Invalid Zip Code");
		} else if (!cityPatt.test(state)) {
		  $('#validation-msg').text("Invalid State");
		} else if (!cityPatt.test(country)) {
		  $('#validation-msg').text("Invalid Country");
		} else {
		  $('#validation-msg').hide();
		  return true;
		}
	}

	function checkSameAddress() {
		// check if user's billing address is same as shipping address
		if ($('#same-shipping-address').is(':checked')) {
		  var billAddress = $('#billing-address').val();
		  var billZipCode = $('#billing-zip-code').val();
		  var billCity = $('#billing-city').val();
		  var billState = $('#billing-state').val();
		  var billCountry = $('#billing-country').val();

		  // set the shipping address to be same as billing address
		  $('#shipping-address').val(billAddress);
		  $('#shipping-zip-code').val(billZipCode);
		  $('#shipping-city').val(billCity);
		  $('#shipping-state').val(billState);
		  $('#shipping-country').val(billCountry);
		}
	}

	function shippingIsValid() {
		// get input from shipping form
		var address = $('#shipping-address').val();
		var zipCode = $('#shipping-zip-code').val();
		var city = $('#shipping-city').val();
		var state = $('#shipping-state').val();
		var country = $('#shipping-country').val();

		// shipping regex patterns
		var addressPatt = /^[0-9]+\ [A-Za-z\  \.]+$/;
		var cityPatt = /^[A-Z][a-z\ \.]+$/;
		var zipPatt = /^[0-9]{5}$/;

		// check shipping form validity
		if (!addressPatt.test(address)) {
		  $('#validation-msg').text("Invalid Address");
		} else if (!zipPatt.test(zipCode)) {
		  $('#validation-msg') .text("Invalid Zip Code");
		} else if (!cityPatt.test(city)) {
		  $('#validation-msg').text("Invalid City");
		} else if (!cityPatt.test(state)) {
		  $('#validation-msg').text("Invalid State");
			} else if (!cityPatt.test(country)) {
		  $('#validation-msg').text("Invalid Country");
		} else {
		  $('#validation-msg').hide();
		  return true;
		}
	}

	function paymentIsValid () {
		// get input from payment forms
		var cardName = $('#card-name').val();
		var cardNumber = $('#card-number').val();
		var expiration = $('#card-expiration').val();
		var cvv = $('#card-cvv').val();

		// check payment form validity
		if (!/^[A-Z][a-z]+\ [A-Z][a-z]+$/.test(cardName)) {
		  $('#validation-msg').text("Invalid Name on Card");
	  	} else if (!/^[0-9]{4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4}$/.test(cardNumber)) {
		  $('#validation-msg') .text("Invalid Card Number");
	  } else if (!/^[0-1][1-2]\/[1-2][0-9]$/.test(expiration)) {
		  $('#validation-msg').text("Invalid Expiration Date");
	  	} else if (!/^[0-9]{3}$/.test(cvv)) {
		  $('#validation-msg').text("Invalid CVV");
		} else {
		  $('#validation-msg').hide();
		  return true;
		}
	}

})(window);
