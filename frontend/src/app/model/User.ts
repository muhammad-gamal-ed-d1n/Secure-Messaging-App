export class User {
    id: number = 0;
    username: string = "";

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}