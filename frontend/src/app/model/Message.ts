export class Message {
    id: number = 0;
    content: string = "";
    timeStamp: string = "";
    chatId: number = 0;
    senderId: number = 0;
    received: boolean = false;
    read: boolean = false;

    constructor(init?: Partial<Message>) {
        Object.assign(this, init);
    }
}
