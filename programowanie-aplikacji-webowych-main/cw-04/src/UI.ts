import AppStorage from './appStorage';
import { Modal } from './modal';
import { Note } from './note';
import { Toolbar } from './toolbar';

// aka Notes
export class UI {
    toolbar: Toolbar;

    constructor() {
        this.bindEvents();
        this.toolbar = new Toolbar(this);
        this.toolbar.renderToolbarTags();
    }

    bindEvents() {
        document.getElementById('add-note').addEventListener('click', (e) => {
            new Modal(null, this);
        })
    }

    async renderNotes() {
        const notes = await AppStorage.getInstance().getFromStorage();
        const notesElP = document.getElementById('notes-pinned');
        const notesEl = document.getElementById('notes-other');
        notesEl.innerText = null; notesElP.innerText = null;

        notes
            .filter((v) => this.toolbar.activeTag !== null ? v.tags.includes(this.toolbar.activeTag) : true)
            .filter((v) =>
                v.title.toLowerCase().includes(this.toolbar.searchTerm) ||
                v.content.toLowerCase().includes(this.toolbar.searchTerm) ||
                v.tags.some((tag) => tag.toLowerCase().includes(this.toolbar.searchTerm))
            )
            .forEach((note) => {
                new Note(note, note.pinned
                    ? notesElP
                    : notesEl, this);
            });
        this.toolbar.renderToolbarTags();
    }
}