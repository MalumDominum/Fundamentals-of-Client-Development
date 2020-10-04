function addNote(name, date, id) {
	let liElement = document.createElement("li")
	liElement.id = "index_" + id;
	liElement.classList.add("note-element");
	liElement.innerHTML = 
			'<div class="note-title">' + name + '</div>' +
            '<div class="note-text">' +
                '<span class="date">' + date.toString() + '</span>' +
            '</div>' +
            '<button class="remove-button" data-index="' + id + '">Remove</button>';
	addRouteListener(liElement);
	addRemoveListener(liElement.getElementsByClassName('remove-button')[0])
	notesList.appendChild(liElement);
}

function updateNotesList(){
	notesList.innerHTML = "";
	for (let note in storage)  {
		addNote(storage[note].name, new Date(storage[note].date), storage[note].id)
	}
}

function addRemoveListener(element) {
	element.addEventListener('click', function(event) {
		delete storage[this.dataset.index];
		localStorage.setItem("notes-list", JSON.stringify(storage));
		document.getElementById("index_" + this.dataset.index).remove();
		event.stopPropagation();
		if (this.dataset.index == history.state.id) {
			document.getElementById("view-title").value = "Select Note";
			document.getElementById("view-date").innerHTML = "";
			document.getElementById("view-text").value = "";
			document.getElementById("edit-button").setAttribute("disabled", true);
			history.pushState(null, null, "#");
		}
	});
}

function addRouteListener(element) {
	element.addEventListener('click', function(event){
		let currentNote = storage[this.id.substring(6)];
		history.pushState(currentNote, null, "#" + currentNote.name + "&id=" + currentNote.id);
		document.getElementById("view-title").value = history.state.name;
		document.getElementById("view-date").innerHTML = history.state.date.toString();
		document.getElementById("view-text").value = history.state.content;
		document.getElementById("edit-button").removeAttribute("disabled");
		document.getElementById("edit-button").innerHTML = "Edit";
		document.getElementById("view-title").setAttribute("disabled", true);
		document.getElementById("view-text").setAttribute("disabled", true);
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
				document.getElementById("view-title").value = history.state.name;
				document.getElementById("view-date").innerHTML = history.state.date.toString();
				document.getElementById("view-text").value = history.state.content;
				document.getElementById("edit-button").removeAttribute("disabled");
			} else {
				history.pushState(null, null, "#");
			}
		} else {
			let found = false;
			for (let note in storage)  {
				if (decodeURI(window.location.href.split("#")[1]) == storage[note].name)  {
					let currentNote = storage[note];
					history.pushState(currentNote, null, "#" + currentNote.name + "&id=" + currentNote.id);
					document.getElementById("view-title").value = history.state.name;
					document.getElementById("view-date").innerHTML = history.state.date.toString();
					document.getElementById("view-text").value = history.state.content;
					document.getElementById("edit-button").removeAttribute("disabled");
					found = true;
				}
			}
			if (!found) {
				history.pushState(null, null, "#");
			}
		}
	}
	document.getElementById("edit-button").addEventListener('click', function(event){
		if (this.innerHTML == "Edit") {
			document.getElementById("view-title").removeAttribute("disabled");
			document.getElementById("view-text").removeAttribute("disabled");
			this.innerHTML = "Save";
		} else {
			this.innerHTML = "Edit";
			document.getElementById("view-title").setAttribute("disabled", true);
			document.getElementById("view-text").setAttribute("disabled", true);
			storage[history.state.id].name = document.getElementById("view-title").value;
			storage[history.state.id].content = document.getElementById("view-text").value;
			localStorage.setItem("notes-list", JSON.stringify(storage));
			let currentNote = storage[history.state.id];
			history.pushState(currentNote, null, "#" + currentNote.name + "&id=" + currentNote.id);
			document.getElementById("view-title").value = history.state.name;
			document.getElementById("view-date").innerHTML = history.state.date.toString();
			document.getElementById("view-text").value = history.state.content;
			document.getElementById("edit-button").removeAttribute("disabled");
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