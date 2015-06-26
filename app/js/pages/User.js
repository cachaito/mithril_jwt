var m       = require('mithril'),
    User    = {};

User = {
    vm: {
        init: function() {
            User.vm.showUserArea = function(token) {
                return token !== null ? true : false;
            }
        }
    },
    controller: function(service) {
        var routeParam = m.prop(null);

        try {
            routeParam(m.route.parseQueryString(m.route.param('userData')));
        } catch (e) {
            routeParam({
                name: 'zalogowany',
                surname: 'użytkowniku'
            });
        }

        User.vm.init();

        return {
            routeParam: routeParam,
            token: service.getToken
        };
    },
    view: function(ctrl) {
        var username = ctrl.routeParam().name + ' ' + ctrl.routeParam().surname;

        return [
            m('div', User.vm.showUserArea(ctrl.token()) === true ?
                m('h1', 'Witaj: ' + username)
            : m('h2', 'brak autoryzacji aby wyświetlic stronę'))
        ]
    }
};

module.exports = User;
