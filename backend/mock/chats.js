
var fs = require('fs');
const bcrypt = require('bcryptjs');

 // users
 const names = [
    'Mac Millan',
    'Johnny Depp',
    'Al Pacino',
    'Suresh Babu',
    'Ramesh Babu',
    'Robert De Niro',
    'Kevin Spacey',
    'Denzel Washington',
    'Russell Crowe',
    'Brad Pitt',
    'Priyanka Chopra',
    'Vidya Balan',
    'Deepika Padukone',
    'Kangana Ranaut',
    'Sameera Reddy',
    'Jacqueline Fernandez',
    'Sonam Kapoor',
    'Alia Bhatt',
    'Angelina Jolie',
    'Aamir Khan',
    'Akshay Kumar',
    'Ajay Devgn',
    'Amjad Khan',
    'Amitabh Bachchan',
    'Amol Palekar',
    'Abhay Deol',
    'Akshaye Khanna',
    'Vigneswaran'
];

// chats
const status = ["unread", "read"];
const tag = ["archive", "favorite", ''];

let users = [];
let chats = [];
let groups = [];

function getUniqueName(members) {
    const arr = members || users;
    const getName = () => {
        const name = names[Math.floor(Math.random() * names.length)];
        const isNameExist = arr.find(u => u.name ===  name);
        if (isNameExist) {
            return getName()
        } else {
            return name;
        }
    }
    return getName();
}

function generateChats(author = '', group = '', message = '') {
    for (let j = 0; j < getRandomInt(3, 15); j++) {
        const chat = {
            "sentAt": Date.now() - (Math.floor(Math.random(10) * (10000000 - 100000) + 100000)),
            "status": status[Math.floor(Math.random() * status.length)],
            "message": message || getRandomPara(),
            "tag": tag[Math.floor(Math.random() * tag.length)],
            "author": author,
            "recipient": group,
            "isGroupChat": !!group,
            "_id": `c${Math.floor(Math.random(10) * (10000000 - 100000) + 10000000)}`
        };
        chat.recipient = chat.recipient || users[getRandomInt(0, users.length-1)]._id;
        chats.push(chat);
    }
}

// generate random para
function getRandomPara() {
    const para = [];
    for (let j = 0; j < getRandomInt(3, 25); j++) {
        para.push(Math.random().toString(36).substring(2, 15).replace(/[0-9]/g, ''));
    }
    return para.join(' ');
}

// random number
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function output() {
    users = [];
    chats = [];
    groups = [];
    for(let i = 0; i < names.length; i++ ) {
        const user = {};
        user._id = `u${Math.floor(Math.random(10) * (10000000 - 100000) + 10000000)}`;
        // bcrypt password while storing
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash('Test@1234', salt);
        user.name = names[i];
        user.email = `${user.name.replace(/ /g,'').toLowerCase()}@gmail.com`;
        user.avatar = `https://loremflickr.com/g/80/80/${user.name.split(' ').toString()}`;
        user.groups = [];
        users.push(user);
    }

    users.forEach(user => {
        const limit = getRandomInt(6, names.length);
        const friends = [];
        for (let j = 0; j < limit; j++) {
            const name = names[Math.floor(Math.random() * names.length)];
            const user = users.find(k => k.name === name);
            if (user) {
                friends.push(user._id);
            }   
        }
        friends.forEach(f => {
           generateChats(f);
        });
    });

    names.forEach(name => {
        const i = {};
        i._id = `g${Math.floor(Math.random(10) * (10000000 - 100000) + 10000000)}`;
        i.name = `${name}'s Fans`;
        const limit = getRandomInt(3, names.length);
        i.members = [];
        for (let j = 0; j < limit; j++) {
            const name =  getUniqueName(i.members);
            const user = users.find(k => k.name === name);
            if (user) {
                user.groups.push(i._id);
                i.members.push(user._id);
            }   
        }
        i.avatar = `https://loremflickr.com/g/80/80/${name.split(' ')[0]}`;
        i.members.forEach(m => {
            generateChats(m, i._id);
        });
        groups.push(i);
    });

    const db = {users, groups, chats};
    fs.writeFileSync(`./db.json`, JSON.stringify(db));
}

output()