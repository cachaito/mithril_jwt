var m   = require('mithril'),
    API = require('../config'),
    url = API.server + ':' + API.port + API.service;

module.exports = {
    loginUser: loginUser,
    logoutUser: logoutUser,
    getToken: getToken
};

function getToken() {
    return localStorage.getItem('token');
}

function logoutUser() {
    console.log('Nastąpiło wylogowanie użytownika');
    // delete localStorage.token;
    localStorage.removeItem('token');
}

function loginUser(credentials) {
    console.log('in service ', credentials);

    return m.request({
        method: 'POST',
        url: url + '/authenticate',
        data: credentials,
        unwrapSuccess: function(res) {
            // localStorage.token = res.token;
            if(res.success && res.token) {
                localStorage.setItem('token', res.token);
            }
            return res;
        }
    });
}
