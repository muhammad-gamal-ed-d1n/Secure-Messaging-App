export class User {
    id: number = 0;
    username: string = "";
    isOnline?: boolean;

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}
