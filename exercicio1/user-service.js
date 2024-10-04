const usersDB = [
    {
        name: "Victor",
        idade: 21,
    },
    {
        name: "Alice",
        idade: 25,
    },
    {
        name: "Bob",
        idade: 30,
    },
    {
        name: "Carol",
        idade: 28,
    }
];

function getUser() {
    return usersDB;
}

function addUser(user) {
    usersDB.push(user);
}

module.exports = {
    getUser,
    addUser,
}; 