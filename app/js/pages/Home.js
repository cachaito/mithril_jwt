var m       = require('mithril'),
    Home    = {};

Home = {
    vm: {
        init: function() {
            this.formData = {
                login: m.prop(''),
                pswd: m.prop('')
            };

            this.message = m.prop(undefined);

            // niepotrzebne
            // Home.vm.showLoginArea = function(token) {
            //     return token !== null ? false : true;
            // };

            this.resetForm = function() {
                this.formData.login('');
                this.formData.pswd('');
            };

            this.displayStatus = function(msg) {
                console.log('MESSAGE X2 ', msg);

                return msg === undefined ? null : m('span', msg);
            };

            this.binds = function(data, callback) {
                return {
                    onsubmit: function(e) {
                        e.preventDefault();

                        Array.prototype.slice.call(e.target, 0)
                            .filter(function(elem) {
                                return elem.type === 'text' || elem.type === 'password';
                            }).forEach(function(elem) {
                                data[elem.name](elem.value);
                            });

                        // for(var i = 0, arr = Array.prototype.slice.call(e.target, 0), arrLength = arr.length; i < arrLength; i+=1) {
                        //     if(arr[i].type === 'text' || arr[i].type === 'password') {
                        //         data[arr[i].name](arr[i].value);
                        //     }
                        // }

                        callback(data);
                    }
                };
            };
        }
    },
    controller: function(service) {

        function userLogin(credentials) {
            if(!credentials.login() || !credentials.pswd()) {
                return Home.vm.message('Wypełnij wszystkie pola!');
            }

            return service.loginUser({login: credentials.login(), pswd: credentials.pswd()})
                .then(function(response) {
                    Home.vm.message(response.message);
                    return response;
                }, function(err) {
                    return Home.vm.message('Error z połączeniem do bazy!');
                })
                .then(function(res) {
                    Home.vm.resetForm.bind(Home.vm);
                    return res;
                }, null)
                .then(function(res) {
                    if(res.success && res.token) {
                        Home.vm.message('Użytkownik został zalogowany');
                        setTimeout(m.route.bind(null, '/user', {userData: m.route.buildQueryString(res.userData)}),2000);
                    }
                }, null);
        }

        function logoutUser(e) {
            e.preventDefault();
            service.logoutUser();
            Home.vm.message('Użytkownik został wylogowany pomyślnie.');
        }

        Home.vm.init();

        return {
            userLogin: userLogin,
            logoutUser: logoutUser,
            token: service.getToken
        };
    },
    view: function(ctrl) {
        console.log('ddddddddddddddd ', ctrl.token())
        return [
            m('h1', {}, 'Strona główna'),
            // m('div', Home.vm.showLoginArea(ctrl.token()) === true ? niepotrzebne wystarczy:
            m('div', ctrl.token() === null ?
                m('form', Home.vm.binds(Home.vm.formData, ctrl.userLogin), [
                    m('input', {type: 'text', placeholder: 'login', name: 'login', value: Home.vm.formData.login()}),
                    m('input', {type: 'password', placeholder: 'hasło', name: 'pswd', value: Home.vm.formData.pswd()}),
                    m('input', {type: 'submit'}, 'Zaloguj'),
                    m('input', {type: 'reset'}, 'Reset')
                ])
             : m('div', {}, [
                m('a', {href: '/user', config: m.route}, 'Przejdź do strony użytkownika'),
                m('a', {href: '#', onclick: ctrl.logoutUser}, 'Wyloguj')
             ])),
            m('div', {}, Home.vm.displayStatus(Home.vm.message()))
        ];
    }
};

module.exports = Home;
