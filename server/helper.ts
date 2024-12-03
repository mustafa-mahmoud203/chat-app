interface User {
    socket_id: string;
    room_id: string;
    user_id: string;
    name: string;
}

class Helper {
    private users: User[];
    constructor() {
        this.users = []
    }

    public addUser(data: User): { user?: User, error?: any } {
        const { socket_id, name, user_id, room_id }: User = data
        const exist: any = this.users.find(user => user.room_id === room_id && user.user_id === user_id);
        if (exist) {
            return { error: 'User already exist in this room' }
        }
        const user: User = { socket_id, name, user_id, room_id };
        this.users.push(user)
        console.log('users list', this.users)
        return { user }
    }
    public getUser(socket_id: string) {
        console.log("dddddddd", this.users);

        console.log("socket_id  ", socket_id);

        return this.users.find(user => user.socket_id === socket_id)
    }
}



// const removeUser = (socket_id) => {
//     const index = users.findIndex(user => user.socket_id === socket_id);
//     if (index !== -1) {
//         return users.splice(index, 1)[0]
//     }
// }
// const getUser = (socket_id) => users.find(user => user.socket_id === socket_id)
export default Helper
