'use strict';
// TODO currently disabled.

//listen to a click event TODO: list id non existent.
var listButton = document.querySelector('#list');
listButton.addEventListener("click", function(event) {
	//view items in list format

	//don't reload page when click event occurs
	event.preventDefault();

	var items = document.querySelectorAll('#products .item');

	for (var i=0; i < items.length; i++){
		items[i].classList.add('list-group-item');
	}
});

var gridButton = document.querySelector('#grid');
gridButton.addEventListener("click", function(event) {
	event.preventDefault;

	var items = document.querySelectorAll('#products .item');

	for(var i=0; i < items.length; i++) {
		items[i].classList.remove('list-group-item');
		items[i].classList.add('grid-group-item');
	}
});





