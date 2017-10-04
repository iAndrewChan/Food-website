"use strict"
//TODO disable scrolling map
// FOOD COUNTDOWN SECTION //

// main product countdown
//get the time of offer from database

var productTimer = {
	main:"2017/10/01 12:34:56",
	recommended1: "2017/06/01 10:34:56",
	recommended2: "2017/06/05 12:34:56",
	recommended3: "2017/06/02 11:34:56"
};

$('#count-down').countdown(productTimer.main)
.on('update.countdown', function(event) {
  var format = '%H:%M:%S';
  if(event.offset.totalDays > 0) {
    format = '%-d day%!d ' + format;
  }
  if(event.offset.weeks > 0) {
    format = '%-w week%!w ' + format;
  }
  $(this).html(event.strftime(format));
})
.on('finish.countdown', function(event) {
  $(this).html('This offer has expired!')
  $(this).css({"opacity": "0.6"});

  // disable the buy button and change opacity
  var buyNowBtn = document.querySelector("#buy-now-btn");
  buyNowBtn.disabled = true;
  buyNowBtn.style.opacity = 0.6;
  buyNowBtn.innerHTML = "Offer has expired";

});

//recommended product timers countdown
$('#recommendation-time-remaining1').countdown(productTimer.recommended1)
.on('update.countdown', function(event) {
  var format = '%H:%M:%S';
  if(event.offset.totalDays > 0) {
    format = '%-d day%!d ' + format;
  }
  if(event.offset.weeks > 0) {
    format = '%-w week%!w ' + format;
  }
  $(this).html(event.strftime(format));
})
.on('finish.countdown', function(event) {
  $(this).html('This offer has expired!')
  $('#recommended-image1').css({"opacity": "0.6"});

  	//preventDefault to represent disabling
  $('#recommended-image1').on('click', function(event){
  	event.preventDefault();
  });

});

$('#recommendation-time-remaining2').countdown(productTimer.recommended2)
.on('update.countdown', function(event) {
  var format = '%H:%M:%S';
  if(event.offset.totalDays > 0) {
    format = '%-d day%!d ' + format;
  }
  if(event.offset.weeks > 0) {
    format = '%-w week%!w ' + format;
  }
  $(this).html(event.strftime(format));
})
.on('finish.countdown', function(event) {
  $(this).html('This offer has expired!')
  $('#recommended-image2').css({"opacity": "0.6"});

  //preventDefault to represent disabling
  $('#recommended-image2').on('click', function(event){
  	event.preventDefault();
  });
});

$('#recommendation-time-remaining3').countdown(productTimer.recommended3)
.on('update.countdown', function(event) {
  var format = '%H:%M:%S';
  if(event.offset.totalDays > 0) {
    format = '%-d day%!d ' + format;
  }
  if(event.offset.weeks > 0) {
    format = '%-w week%!w ' + format;
  }
  $(this).html(event.strftime(format));
})
.on('finish.countdown', function(event) {
  $(this).html('This offer has expired!')
  $('#recommended-image3').css({"opacity": "0.6"});

  //preventDefault to represent disabling
  $('#recommended-image3').on('click', function(event){
  	event.preventDefault();
  });
});

//// PURCHASE SECTION ////

var quantity = document.querySelector("#quantity-input");
var totalPrice = document.querySelector("#txt-price");
var pricePerItem = parseFloat(totalPrice.innerHTML); //totalPrice initially contains the price per item value from server

totalPrice.innerHTML = '£' + ' ' + (quantity.value * pricePerItem).toFixed(2);

// event listener for the value change on the input box
quantity.addEventListener("input", function() {
	// check a value exists
	if(quantity.value) {
	// dynamic value dependent on input
	totalPrice.innerHTML = '£' + ' ' + (quantity.value * pricePerItem).toFixed(2); }
})

// give buttons action
var minusBtn = document.querySelector("#btn-minus");
var plusBtn = document.querySelector("#btn-plus");

minusBtn.addEventListener("click", function() {
	// decrease quantity
	// by default keep atleast 1 item
	if (quantity.value > 1) {
	quantity.value--;
	// update output
	totalPrice.innerHTML = '£' + ' ' + (quantity.value * pricePerItem).toFixed(2); }
})

plusBtn.addEventListener("click", function() {
	quantity.value++;
	// update output
	totalPrice.innerHTML = '£' + ' ' + (quantity.value * pricePerItem).toFixed(2);
})

//  for confirming purchase
var purchaseBtn = document.querySelector("#buy-now-btn");
var confirmIt = function(e) {
  if(!confirm("Are you finished with your purchase?")) e.preventDefault();
}
puchaseBtn.addEventListener('click', confirmIt, false);

//// GOOGLE MAP ////
function getCoordinates (address, callback) {
	var coordinates;
	var geocoder = new google.maps.Geocoder();

	// finding the store location with google map
	geocoder.geocode({address: address}, function(results, status){
		coordinates = results[0].geometry.location;
		callback(coordinates);
	});
}

function getInfo (){
	var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Wow food</h1>'+
            '<div id="bodyContent">'+
            '<p><b>About the business or offer </b>,  blah blah</p>'+
            '</div>'+
            '</div>';
    return contentString;
}

function initMap() {
	//get address from database
	// var storeAddress = "cardiff wales";
	var storeAddress = document.querySelector("#deal-location").innerHTML;
	getCoordinates(storeAddress, function(coordinates){
		var map = new google.maps.Map(document.getElementById('store-map'), {
    	center: {lat: coordinates.lat(), lng: coordinates.lng()},
        zoom: 17,
        scrollwheel: false
		});

		var infowindow = new google.maps.InfoWindow({
          content: getInfo()
        });

		var marker = new google.maps.Marker({
          position: {lat: coordinates.lat(), lng: coordinates.lng()},
          map: map
        });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
	});
}