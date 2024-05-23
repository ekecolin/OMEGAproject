import NotesView from "./NotesView.js"; // Import the NotesView class
import NotesAPI from "./NotesAPI.js"; // Import the NotesAPI class

// Main application class for managing notes
export default class App {
    constructor(root) { // Constructor for the App class
        this.notes = []; // Holds all notes in memory
        this.activeNote = null; // Stores the currently active (selected) note
        this.view = new NotesView(root, this._handlers()); // Initializes the view layer

        this._refreshNotes(); // Initial fetch and display of notes
    }

    // Fetches notes from storage and updates the view
    _refreshNotes() {
        const notes = NotesAPI.getAllNotes(); // Retrieve all notes from local storage
        this._setNotes(notes); // Update notes array and display

        if (notes.length > 0) {
            this._setActiveNote(notes[0]); // Set the first note as active by default
        }
    }

    // Updates the notes array and refreshes the list view
    _setNotes(notes) {
        this.notes = notes; // Store the notes in the class
        this.view.updateNoteList(notes); // Refresh the list view in the UI
        this.view.updateNotePreviewVisibility(notes.length > 0); // Show or hide the preview pane
    }

    // Sets the active note and updates the note preview display
    _setActiveNote(note) {
        this.activeNote = note; // Set the selected note as active
        this.view.updateActiveNote(note); // Update the preview pane to show the active note
    }

    // Handlers for various user interactions
    _handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId); // Find the note by id
                this._setActiveNote(selectedNote); // Set the found note as active
            },
            onNoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "Take note..."
                };

                NotesAPI.saveNote(newNote); // Save the new note
                this._refreshNotes(); // Refresh notes to include the new note
            },
            onNoteEdit: (title, body) => {
                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title,
                    body
                }); // Save the updated details of the current note

                this._refreshNotes(); // Refresh the list to show the updated note
            },
            onNoteDelete: noteId => {
                NotesAPI.deleteNote(noteId); // Delete the note by id
                this._refreshNotes(); // Refresh the list to remove the deleted note
            },
        };
    }
}