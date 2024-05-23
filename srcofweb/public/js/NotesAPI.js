export default class NotesAPI {
    // Retrieves all notes stored in localStorage, parses them, and returns them sorted by most recently updated.
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

        // Sort notes by the 'updated' timestamp in descending order
        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    // Saves a new note or updates an existing one in localStorage.
    static saveNote(noteToSave) {
        const notes = NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);

        // If the note exists, update it
        if (existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        } else {
            // If it's a new note, assign a unique ID and set the current timestamp
            noteToSave.id = Math.floor(Math.random() * 1000000);
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
        }

        // Serialize the updated notes array and save it back to localStorage
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

    // Deletes a note by its ID from localStorage.
    static deleteNote(id) {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);

        // Update localStorage with the new array after removing the note
        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    }
}
