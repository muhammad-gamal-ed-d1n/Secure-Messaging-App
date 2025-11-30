export class User {
    id: number = 0;
    username: string = "";
    chats: number[] = [];

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}