class Helper {
    constructor() {
        this.users = [];
    }
    addUser(data) {
        const { socket_id, name, user_id, room_id } = data;
        const exist = this.users.find(user => user.room_id === room_id && user.user_id === user_id);
        if (exist) {
            return { error: 'User already exist in this room' };
        }
        const user = { socket_id, name, user_id, room_id };
        this.users.push(user);
        console.log('users list', this.users);
        return { user };
    }
    getUser(socket_id) {
        console.log("dddddddd", this.users);
        console.log("socket_id  ", socket_id);
        return this.users.find(user => user.socket_id === socket_id);
    }
}
// const removeUser = (socket_id) => {
//     const index = users.findIndex(user => user.socket_id === socket_id);
//     if (index !== -1) {
//         return users.splice(index, 1)[0]
//     }
// }
// const getUser = (socket_id) => users.find(user => user.socket_id === socket_id)
export default Helper;
