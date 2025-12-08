import { User } from "./User";

export class Chat {
    id: number = 0;
    users: User[] = [];
    otherUsername: string = "";

    constructor(init?: Partial<Chat>) {
        Object.assign(this, init);
    }
}