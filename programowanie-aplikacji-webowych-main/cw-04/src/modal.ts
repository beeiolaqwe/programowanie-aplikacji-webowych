import { INote, NoteColors } from './interface';

import AppStorage from './appStorage';
import { UI } from './UI';

export class Modal {
    closeBtn: HTMLButtonElement;
    saveBtn: HTMLButtonElement;
    addTagBtn: HTMLButtonElement;
    notifBtn: HTMLButtonElement;
    modalEl: HTMLElement;
    noteForm: INote;
    note: INote;
    UI: UI;
    isNotification: boolean;
    formElements: {
        title: HTMLInputElement,
        content: HTMLTextAreaElement,
        pinned: HTMLInputElement,
        color: HTMLDivElement,
        newTag: HTMLInputElement,
        notifDate: HTMLInputElement,
        notifTime: HTMLInputElement
    };

    constructor(note: INote = null, UIInstance: UI) {
        this.closeBtn = document.getElementById('close-modal-btn') as HTMLButtonElement;
        this.saveBtn = document.getElementById('save-modal-btn') as HTMLButtonElement;
        this.addTagBtn = document.getElementById('add-tag') as HTMLButtonElement;
        this.notifBtn = document.getElementById('notif-btn') as HTMLButtonElement;
        this.modalEl = document.getElementById('modal');
        this.UI = UIInstance;
        this.note = note;
        this.formElements = {
            title: this.modalEl.querySelector('#note-title') as HTMLInputElement,
            content: this.modalEl.querySelector('#note-content') as HTMLTextAreaElement,
            pinned: this.modalEl.querySelector('#note-pinned') as HTMLInputElement,
            color: this.modalEl.querySelector('#color-picker') as HTMLDivElement,
            newTag: this.modalEl.querySelector('#note-newTag') as HTMLInputElement,
            notifDate: this.modalEl.querySelector('#note-notif-date') as HTMLInputElement,
            notifTime: this.modalEl.querySelector('#note-notif-time') as HTMLInputElement
        }
        this.noteForm = note === null ? new INote() : note;
        this.isNotification = this.noteForm.notification > Date.now();
        this.changeNotifPanelVisibility();
        this.closeModal = this.closeModal.bind(this);
        this.saveModal = this.saveModal.bind(this);
        this.addTag = this.addTag.bind(this);
        this.turnOnNotif = this.turnOnNotif.bind(this);

        this.saveBtn.disabled = !this.noteForm.title;
        this.checkValidation = this.checkValidation.bind(this);

        this.render();
        this.addEventListeners();
    }

    checkValidation(e: InputEvent) {
        this.saveBtn.disabled = !(e.target as HTMLInputElement).validity.valid;
    }

    addEventListeners() {
        this.closeBtn.addEventListener('click', this.closeModal);
        this.saveBtn.addEventListener('click', this.saveModal);
        this.addTagBtn.addEventListener('click', this.addTag);
        this.notifBtn.addEventListener('click', this.turnOnNotif);
        this.formElements.title.addEventListener('input', this.checkValidation);
    }

    saveModal(e: MouseEvent) {
        e.preventDefault();
        const newNote = new INote({
            id: this.noteForm.id ?? null,
            title: this.formElements.title.value,
            content: this.formElements.content.value,
            pinned: this.formElements.pinned.checked,
            color: (this.formElements.color.querySelector(':checked') as HTMLInputElement).value,
            tags: this.noteForm.tags,
            notification: this.isNotification ? this.formatDate() : null
        });
        if (!this.note)
            AppStorage.getInstance().saveToStorage(newNote).then(() => this.UI.renderNotes());
        else
            AppStorage.getInstance().updateNote(newNote, newNote.id).then(() => this.UI.renderNotes());
        this.closeModal(e);
    }

    closeModal(e: MouseEvent) {
        e.preventDefault();
        this.closeBtn.removeEventListener('click', this.closeModal);
        this.saveBtn.removeEventListener('click', this.saveModal);
        this.addTagBtn.removeEventListener('click', this.addTag);
        this.modalEl.classList.remove('modal--visible');
        this.formElements.color.innerText = '';
    }

    turnOnNotif(e: MouseEvent) {
        e.preventDefault();
        this.isNotification = !this.isNotification;
        this.changeNotifPanelVisibility();
    }

    changeNotifPanelVisibility() {
        const notifContentEl = document.getElementById('notification-content');
        const now = new Date();
        if (this.isNotification) {
            notifContentEl.classList.add('notification-content--visible');
            this.notifBtn.classList.add('modal-small-btn--active');
            this.formElements.notifDate.min = now.toISOString().split("T")[0];
        } else {
            notifContentEl.classList.remove('notification-content--visible');
            this.notifBtn.classList.remove('modal-small-btn--active');
        }
    }

    formatDate() {
        const timestamp = new Date(`${this.formElements.notifDate.value} ${this.formElements.notifTime.value}`).getTime();

        return timestamp;
    }

    addTag(e: MouseEvent) {
        e.preventDefault();
        const newTag = this.formElements.newTag.value;
        this.formElements.newTag.value = '';
        if (this.noteForm.tags.indexOf(newTag) === -1) this.noteForm.tags.push(newTag);
        this.createTagList();
        this.createDatalistOptionsList();
    }

    createColorPicker() {
        NoteColors.forEach((v) => {
            const inputContainer = document.createElement('label');
            inputContainer.className = "color-radio";
            const input = document.createElement('input');
            const styler = document.createElement('span');
            styler.style.backgroundColor = v;
            styler.className = "styler";
            input.type = "radio";
            input.name = "note-color";
            input.value = v;
            inputContainer.appendChild(input);
            inputContainer.appendChild(styler);
            if (input.value === this.noteForm.color)
                input.checked = true;

            this.formElements.color.appendChild(inputContainer);
        });
    }

    createTagList() {
        const parentEl = document.getElementById("current-tags");
        parentEl.innerHTML = '';
        this.noteForm.tags.forEach((v) => {
            const tagBtn = document.createElement('button');
            tagBtn.className = "tag";
            tagBtn.innerText = v;
            const removeIcon = document.createElement('img');
            removeIcon.src = './assets/remove.svg';
            tagBtn.appendChild(removeIcon);
            tagBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.noteForm.tags = this.noteForm.tags.filter(tag => tag !== v);
                this.createTagList();
                this.createDatalistOptionsList();
            })
            parentEl.appendChild(tagBtn);
        });
    }

    async createDatalistOptionsList() {
        const comboBoxDL = document.getElementById("note-tags");
        comboBoxDL.innerHTML = '';

        const tags = await AppStorage.getInstance().getAllTagsStorage();
        const filteredTags = tags.filter((v) => !this.noteForm.tags.includes(v));
        filteredTags.forEach((v) => {
            const option = document.createElement('option');
            option.value = v;
            comboBoxDL.appendChild(option);
        })
    }

    populateForm() {
        this.formElements.title.value = this.noteForm.title;
        this.formElements.content.value = this.noteForm.content;
        this.formElements.pinned.checked = this.noteForm.pinned;
        this.createColorPicker();
        this.createTagList();
        this.createDatalistOptionsList();
    }

    render() {
        this.modalEl.classList.add('modal--visible');
        this.populateForm();
    }
}