const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
const viewTitle = document.getElementById("view-title");
const viewDate = document.getElementById("view-date"); 
const viewText = document.getElementById("view-text");
const editButton = document.getElementById("edit-button");
function addNote(name, date, id) {
	let liElement = document.createElement("li")
	liElement.id = "index_" + id;
	liElement.classList.add("note-element");
	liElement.innerHTML = 
			'<div class="note-title">' + name + '</div>' +
            '<div class="note-text">' +
                '<span class="date">' + date.toLocaleDateString('en-EN', dateOptions) + '</span>' +
            '</div>' +
            '<button class="remove-button" data-index="' + id + '">⨉</button>';
	addRouteListener(liElement);
	addRemoveListener(liElement.getElementsByClassName('remove-button')[0])
	notesList.appendChild(liElement);
	noteTitle.value = '';
}

function updateNotesList() {
	notesList.innerHTML = "";
	for (let note in storage)  {
		addNote(storage[note].name, new Date(storage[note].date), storage[note].id)
	}
}

function setCurrentNote() {
	var longDateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' };
	viewTitle.value = history.state.name;
	viewDate.innerHTML = new Date(history.state.date).toLocaleDateString('en-EN', longDateOptions);
	viewText.value = history.state.content;
	editButton.removeAttribute("disabled");
}

function addRemoveListener(element) {
	element.addEventListener('click', function(event) {
		delete storage[this.dataset.index];
		localStorage.setItem("notes-list", JSON.stringify(storage));
		document.getElementById("index_" + this.dataset.index).remove();
		event.stopPropagation();
		if (this.dataset.index == history.state.id) {
			viewTitle.value = "Select Note"; 
			viewDate.innerHTML = "";
			viewText.value = "";
			editButton.setAttribute("disabled", true);
			history.pushState(null, null, "#");
		}
	});
}

function addRouteListener(element) {
	element.addEventListener('click', function(event){
		let currentNote = storage[this.id.substring(6)];
		history.pushState(currentNote, null, "#" + currentNote.name + "&id=" + currentNote.id);
		setCurrentNote()
		editButton.innerHTML = "Edit";
		viewTitle.setAttribute("disabled", true);
		viewText.setAttribute("disabled", true);
	});
}

let storage = JSON.parse(localStorage.getItem("notes-list"))
storage = storage ? storage : {}; 
let notesList = document.getElementById("notes-list");

document.addEventListener("DOMContentLoaded", function(event) { 
	updateNotesList();
	if (decodeURI(window.location.href.split("#")[1])) {
		let id = window.location.href.split('&id=')[1];
		console.log(id);
		if (id) {
			if(storage[id]) {
				let currentNote = storage[id];
				history.pushState(currentNote, null, "#" + currentNote.name + "&id=" + currentNote.id);
				setCurrentNote()
			} else {
				history.pushState(null, null, "#");
			}
		} else {
			let found = false;
			for (let note in storage)  {
				if (decodeURI(window.location.href.split("#")[1]) == storage[note].name)  {
					let currentNote = storage[note];
					history.pushState(currentNote, null, "#" + currentNote.name + "&id=" + currentNote.id);
					setCurrentNote()
					found = true;
				}
			}
			if (!found) {
				history.pushState(null, null, "#");
			}
		}
	}
	editButton.addEventListener('click', function(event){
		if (this.innerHTML == "Edit") {
			viewTitle.removeAttribute("disabled");
			viewText.removeAttribute("disabled");
			this.innerHTML = "Save";
		} else {
			this.innerHTML = "Edit";
			viewTitle.setAttribute("disabled", true);
			viewText.setAttribute("disabled", true);
			storage[history.state.id].name = viewTitle.value;
			storage[history.state.id].content = viewText.value;
			//storage[history.state.id].date = new Date();
			localStorage.setItem("notes-list", JSON.stringify(storage));
			let currentNote = storage[history.state.id];
			history.pushState(currentNote, null, "#" + currentNote.name + "&id=" + currentNote.id);
			setCurrentNote()
			updateNotesList();
		}
	});
});
let addButton = document.getElementById("add-button");
let noteTitle = document.getElementById("note-title");
addButton.onclick = function(event) {
	let keys = Object.keys(storage);
	let max = keys.length ? keys.reduce(function(a, b) {
		return Math.max(+a, +b);
	}) : 0;
	let note = {
		id : max + 1,
		name : noteTitle.value,
		date : new Date(),
		content : ""
	}
	storage[max + 1] = (note);
	addNote(note.name, note.date, note.id);
	localStorage.setItem("notes-list", JSON.stringify(storage));
}