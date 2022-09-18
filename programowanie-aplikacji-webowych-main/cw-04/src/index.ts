import './style.scss';

import { INote } from './interface';
import { UI } from './UI';

export class Main {
    UI: UI;
    notes: INote[];
    constructor() {
        this.UI = new UI();
        this.UI.renderNotes();
    }
} 


new Main();