import { AppNotifications } from './notificationService';
import AppStorage from './appStorage';
import { INote } from './interface';
import { Modal } from './modal';
import { UI } from './UI';
import { getDay } from './utils';

export class Note {
    UI: UI;
    constructor(note: INote, parent: HTMLElement, UIInstance: UI) {
        this.render(note, parent)
        this.UI = UIInstance;
    }

    createNoteElement(note: INote) {
        const noteEl = document.createElement('div');
        noteEl.className = 'note';
        noteEl.style.backgroundColor = note.color;
        noteEl.id = `noteEl_${note.id}`;
        noteEl.tabIndex = 0;
        noteEl.addEventListener('click', (e: MouseEvent) => {
            new Modal(note, this.UI);
            // AppNotifications.getInstance().addNotification(note);
        });
        noteEl.addEventListener('keyup', (e: KeyboardEvent) => {
            if (e.code === 'Enter' || e.code === 'Space') {
                new Modal(note, this.UI);
            }
        });

        return noteEl;
    }

    createPinBtn(note: INote) {
        const noteElPinBtn = document.createElement('button');
        noteElPinBtn.className = 'note-pin';
        const noteElPinBtnIcon = document.createElement('img');
        noteElPinBtnIcon.src = note.pinned ? './assets/pin-filled.svg' : './assets/pin.svg';
        noteElPinBtn.appendChild(noteElPinBtnIcon);
        // -------
        noteElPinBtn.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
            note.pinned = !note.pinned;
            AppStorage.getInstance().updateNote(note, note.id).then(() => this.UI.renderNotes());
        })

        return noteElPinBtn;
    }

    createRemoveBtn(note: INote) {
        const noteElRemoveBtn = document.createElement('button');
        noteElRemoveBtn.className = 'note-remove';
        const noteElRemoveBtnIcon = document.createElement('img');
        noteElRemoveBtnIcon.src = './assets/remove.svg';
        noteElRemoveBtn.appendChild(noteElRemoveBtnIcon);
        // -------
        noteElRemoveBtn.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
            AppStorage.getInstance().removeFromStorage(note.id).then(() => this.UI.renderNotes());
        })

        return noteElRemoveBtn;
    }

    render(note: INote, parent: HTMLElement) {
        const noteEl = this.createNoteElement(note);
        // title
        const noteElTitle = document.createElement('p');
        noteElTitle.className = 'note-title';
        noteElTitle.innerText = note.title;
        // content 
        const noteElContent = document.createElement('p');
        noteElContent.className = 'note-content';
        noteElContent.innerText = note.content;
        // pin button
        const noteElPinBtn = this.createPinBtn(note);
        // remove btn
        const noteElRemoveBtn = this.createRemoveBtn(note);
        // tags 
        const noteTagsEl = document.createElement('ul');
        noteTagsEl.className = "note-tags";
        note.tags.forEach((v) => {
            const tag = document.createElement('li');
            tag.innerText = v;
            noteTagsEl.appendChild(tag);
        });
        // date
        const noteDateEl = document.createElement('time');
        noteDateEl.innerText = getDay(note.date);
        // notification time
        const noteNotifEl = document.createElement('p');
        noteNotifEl.className = "note-notif";
        if (note.notification && note.notification > Date.now()) {
            noteNotifEl.innerText = `Notification on ${getDay(note.notification)}`;
        }

        // appending
        noteEl.append(noteElTitle, noteElContent, noteElPinBtn, noteNotifEl, noteTagsEl, noteDateEl, noteElRemoveBtn);
        parent.appendChild(noteEl);
    }
}