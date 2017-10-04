"use strict"

//TODO fix outline detection : only detected within in the div not the children
// dragEnter and dragLeave detected to many times.

var dragElement = null; //initialise

function dragStart(event) {
	//user starts drag an element
	this.style.opacity = '0.4';
	// change cursor
	// console.log("you tried to drag me");

	dragElement = this; // store the element being dragged

	//tranfer(send) html data to another element
	event.dataTransfer.effectAllowed = 'move';
	event.dataTransfer.setData('text/html', this.innerHTML);
}

function dragOver(event) {
	// console.log("detecting pick up");
	event.preventDefault(); //allows drop event
}

function dragEnter(event) {
	//detects drag element entering an element region.
	event.stopPropagation();
	console.log("entered an element region");
	this.classList.add('outline');
}

function dragLeave(event){
	event.stopPropagation();
	console.log("you just left an element region");
	this.classList.remove('outline');
}

function drop(event){
	// console.log("dropped me");

	event.stopPropagation();

	// Transfer data only when the elements are different. Can't be itself
	if(dragElement != this){

		//transfer HTML
		dragElement.innerHTML = this.innerHTML; // place occupying html into the drag source element
		this.innerHTML = event.dataTransfer.getData('text/html');

		//transfer links
		var sourceLink = this.parentNode.href;
		this.parentNode.href = dragElement.parentNode.href;
		dragElement.parentNode.href = sourceLink;

	//remove outline after drop occurs
	this.classList.remove('outline');
	}
}

function dragEnd(event){
	// console.log("drag ended");

	// set opacity to normal when drag event finishes
	this.style.opacity = 1;
}

var activateDrag = false; // init
var column = document.querySelectorAll('.container .item');


//listen to button event 
var customiseBtn = document.querySelector("#customise");
customiseBtn.addEventListener('click', function(event){

	//check current state when clicked
	if(activateDrag===true){
		// console.log("drag feature off");
		activateDrag=false;
	}
	else {
		// console.log("drag feature on");
		activateDrag=true;
	}

	//disable drag feature
	if(!activateDrag){
		this.innerHTML = "Customise Off"
		column.forEach(function(element) {
			element.removeEventListener('dragstart', dragStart, false);
			element.removeEventListener('dragover', dragOver, false); //detects when the element drag is active
			element.removeEventListener('drop', drop, false);

			//visual purpose for showing hovering around an element region TODO
			// element.removeEventListener('dragenter', dragEnter, false);
			// element.removeEventListener('dragleave', dragLeave, false);

			// When the drag events ends after dropping.
			element.removeEventListener('dragend', dragEnd, false);
		});
	}

	//activate drag feature
	if(activateDrag){
		this.innerHTML = "Customise On";
	//listen to the elements 
		column.forEach(function(element) {
			element.addEventListener('dragstart', dragStart, false);
			element.addEventListener('dragover', dragOver, false); //detects when the element drag is active
			element.addEventListener('drop', drop, false);

			//visual purpose for showing hovering around an element region TODO
			// element.addEventListener('dragenter', dragEnter, false);
			// element.addEventListener('dragleave', dragLeave, false);

			// When the drag events ends after dropping.
			element.addEventListener('dragend', dragEnd, false);
		});
	}

})
