var fs = require('fs');

module.exports = {
    readMockedFile: readMockedFile,
    listUser: listUser,
    authenticate: authenticate
};

function readMockedFile(path) {

    var db;

    try {
        db = JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch(e) {
        console.log('Error odczytu ', e);
        db = undefined;
    } finally {
        return db;
    }
}

function listUser(passed, callback) {
    if(!passed.data) {
        return callback('Nie ma bazy użytkowników!', null);
    }

    if(passed.user === null) { //list all
        return callback(null, passed.data);
    }
}

function authenticate(passed, callback) {
    var signed,
        token;

    if(!passed.data) {
        return callback('Nie ma bazy użytkowników!', null);
    }

    var user = passed.data.users.filter(function(query) {
        return query.login === passed.user.login;
    });

    if(user.length === 0) {
        return callback('Nie znaleziono użytkownika!', null);
    }

    user.forEach(function(elem) {
        signed = elem.password === passed.user.pswd ? true : false;
    });

    if(!signed) {
        return callback(null, {success: false, message: 'Użytkownik ' + user[0].name + ' znaleziony ale podał złe hasło.'});
    }

    return callback(null, {success: true, userData: {name: user[0].name, surname: user[0].surname}, message: 'Użytkownik zwerfikowany: '+ user[0].name+' '+user[0].surname});
}
