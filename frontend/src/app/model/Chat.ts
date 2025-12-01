export class Chat {
    id: number = 0;
    users: number[] = [];

    constructor(init?: Partial<Chat>) {
        Object.assign(this, init);
    }
}