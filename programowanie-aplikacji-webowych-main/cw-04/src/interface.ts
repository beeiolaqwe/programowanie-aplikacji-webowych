import { v4 } from 'uuid';

export const NoteColors = ["#262626", "#662424", "#7b4f00", "#007b3d", "#004e7b", "#31094f"];

export class INoteGen {
    id: string;
    title: string = '';
    content: string = '';
    pinned: boolean = false;
    color: string = "#262626";
    notification: number;
    tags: string[] = [];
}

export class INote extends INoteGen {
    id: string;
    date: number = Date.now();

    constructor(data: INoteGen = null) {
        super();
        this.id = data?.id ?? v4();
        // TODO do this better :C
        if (data && Object.keys(data).length) {
            this.title = data.title;
            this.content = data.content;
            this.pinned = data.pinned;
            this.color = data.color;
            this.tags = data.tags;
            this.notification = data.notification;
        }
    }
}

