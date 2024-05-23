export default class NotesView {
    // Constructor initializes the NotesView with handlers and sets up the UI.
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;  // The root container for the note view.
        this.onNoteSelect = onNoteSelect;  // Handler for when a note is selected.
        this.onNoteAdd = onNoteAdd;  // Handler for adding a new note.
        this.onNoteEdit = onNoteEdit;  // Handler for editing an existing note.
        this.onNoteDelete = onNoteDelete;  // Handler for deleting a note.

        // Sets the HTML structure inside the root element.
        this.root.innerHTML = `
            <div class="notes__sidebar">
                <button class="notes__add" type="button">Add Note</button>
                <div class="notes__list"></div>
            </div>
            <div class="notes__preview">
                <input class="notes__title" type="text" placeholder="New Note...">
                <textarea class="notes__body">Take Note...</textarea>
            </div>
        `;

        // Grab references to UI elements.
        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");

        // Event listener for adding a note.
        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        // Event listeners for updating note details when the user stops editing (on blur).
        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();
                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

        // Initially set the note preview to hidden.
        this.updateNotePreviewVisibility(false);
    }

    // Helper function to create HTML for a list item.
    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;  // Limit preview to 60 characters.

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    // Updates the list of notes on the sidebar.
    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list"); // Get the list container.
        notesListContainer.innerHTML = "";  // Clear existing notes.
 
        for (const note of notes) { // Loop through each note and add it to the list.
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated)); // Create HTML for the note.
            notesListContainer.insertAdjacentHTML("beforeend", html); // Add the note to the list.
        }

        // Set up click handlers for each note in the list.
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => { // Handle note selection.
                this.onNoteSelect(noteListItem.dataset.noteId); // Pass the note ID to the handler.
            });

            // Setup delete button within each note.
            const deleteButton = document.createElement('button'); // Create a delete button.
            deleteButton.textContent = 'Delete'; // Set the button text.
            deleteButton.classList.add('delete-button'); // Add a class for styling.
            noteListItem.appendChild(deleteButton); // Add the button to the note list item.

            deleteButton.addEventListener('click', (event) => { // Handle delete button click.
                event.stopPropagation(); // Stop event from bubbling to prevent note selection.
                const doDelete = confirm("Are you sure you want to delete this note?"); // Confirm deletion.
                if (doDelete) { // If confirmed, call the delete handler.
                    this.onNoteDelete(noteListItem.dataset.noteId); // Pass the note ID to the handler.
                }
            });
        });
    }

    // Updates the display of the active note in the preview area.
    updateActiveNote(note) { // Update the active note in the preview area.
        this.root.querySelector(".notes__title").value = note.title; // Set the title.
        this.root.querySelector(".notes__body").value = note.body; // Set the body.

        // Highlight the active note in the list.
        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => { // Loop through each note.
            noteListItem.classList.remove("notes__list-item--selected"); // Remove the selected class.
        });
        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected"); // Add selected class.
    }

    // Toggles the visibility of the note preview area.
    updateNotePreviewVisibility(visible) { // Toggle the visibility of the note preview area.
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";  // Show or hide the preview.
    }
}
