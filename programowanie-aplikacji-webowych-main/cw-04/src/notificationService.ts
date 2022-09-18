import { INote } from "./interface";

interface IAppNotifications {
    addNotification: (newNote: INote) => void,
    checkPermissions: () => Promise<Boolean>
}

// Singleton app notifications
export class AppNotifications implements IAppNotifications {
    private static instance: IAppNotifications;
    pendingNotifications: {
        id: NodeJS.Timeout,
        noteId: string
    }[] = [];
    private constructor() { }

    public static getInstance(): IAppNotifications {
        if (!AppNotifications.instance) {
            AppNotifications.instance = new AppNotifications();
        }

        return AppNotifications.instance;
    }

    async checkPermissions(): Promise<Boolean> {
        if (!('Notification' in window)) {
            console.error("This browser does not support notifications.");
            return false;
        } else {
            if (Notification.permission === "granted") {
                return true;
            } else {
                return Notification.requestPermission().then((val) => {
                    return val === 'granted';
                });
            }
        }
    }
    
    async addNotification(note: INote) {
        this.checkPermissions().then((granted) => {
            if (granted) {
                const timeout = note.notification - Date.now();
                // cancel if already exists
                const existingIndex = this.pendingNotifications.findIndex((v) => v.noteId === note.id);
                if(existingIndex >= 0) {
                    clearTimeout(this.pendingNotifications[existingIndex].id);
                    this.pendingNotifications.splice(existingIndex, 1);
                }
                console.log(this.pendingNotifications);
                // ofc only front-end and app life time implementation
                const notifTimeout = setTimeout(() => {
                    new Notification(note.title);
                }, timeout);
                this.pendingNotifications.push({
                    id: notifTimeout,
                    noteId: note.id
                });

            }
        });
    }

}