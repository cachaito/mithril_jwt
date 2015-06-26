var m           = require('mithril'),
    loginSrvc   = require('./model/jwtSrvc');

var Home = m.component(require('./pages/Home'), loginSrvc, 'some Text'),
    User = m.component(require('./pages/User'), loginSrvc);

m.route.mode = 'hash';

m.route(document.body, '/', {
    '/': Home,
    '/user': User
});
