"use strict"

/* TODO
* smooth animation
* fix the positioning of the image and text in the fluid container
*/

console.log("loaded...")
  
var shoppingCart = document.querySelector("#logo-image");
shoppingCart.addEventListener('mouseover', function() {
	console.log("hovered over cart");
	var position = 0;
    var id = setInterval(frame, 10);
    function frame() {
    	/*reset*/
        if (position == 350) {
            clearInterval(id);
        } else {
            position++; 
            shoppingCart.style.left = position + 'px'; 
            console.log(shoppingCart);
        }
    }

});
