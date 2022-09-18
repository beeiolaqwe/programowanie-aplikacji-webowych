import AppStorage from './appStorage';
import { UI } from './UI';

export class Toolbar {
    activeTag: string;
    searchTerm: string;
    UI: UI;
    
    constructor(UIInstance: UI) {
        this.activeTag = null;
        this.searchTerm = '';
        this.UI = UIInstance;
        this.bindSearchEvents();
    }

    bindSearchEvents() {
        const searchEl = document.getElementById('search') as HTMLInputElement; 
        searchEl.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.searchTerm = target.value.trim().toLowerCase();
            this.UI.renderNotes();
        });

        const searchBtnEl = document.getElementById('search-clear') as HTMLButtonElement; 
        searchBtnEl.addEventListener('click', (e) => {
            searchEl.value = '';
            this.searchTerm = '';
            this.UI.renderNotes();
        });
    }

    async renderToolbarTags() {
        const tags = await AppStorage.getInstance().getAllTagsStorage();
        const parentEl = document.getElementById('toolbarTags');
        parentEl.innerHTML = '';
        // render `All` btn
        const btn = document.createElement('button');
        btn.className = `toolbar-button ${this.activeTag === null && 'toolbar-button--active'}`;
        btn.innerText = 'All';
        parentEl.appendChild(btn);

        tags.forEach((v) => {
            const btn = document.createElement('button');
            btn.className = `toolbar-button ${this.activeTag === v && 'toolbar-button--active'}`;
            btn.innerText = v;
            parentEl.appendChild(btn);
        });

        Array.from(parentEl.children).forEach((v: HTMLButtonElement, i) => {
            v.addEventListener('click', this.setActiveTag.bind(this, v, i));
        })
    }

    setActiveTag(el: HTMLButtonElement, index: number) {
        // dummy way to get `All` btn
        if (index === 0) this.activeTag = null;
        else this.activeTag = el.innerText;
        
        this.UI.renderNotes();
    }
}
