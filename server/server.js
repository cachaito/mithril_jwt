var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var jwt             = require('jsonwebtoken');
var secret          = process.env.npm_package_config_SECRET || 'haha';
var port            = process.env.npm_package_config_PORT || process.env.PORT || 7777;
var userSrvc        = require('./mockedUserSrvc');
// get an instance of the router for api routes - look bottom at app.use('/api', apiRoutes); where it's all connected
var apiRoutes       = express.Router();
var mockedUserData  = userSrvc.readMockedFile('./server/mocked_user.json');

// use secret variable
app.set('superSecret', secret);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
});

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// apiRoutes is always postfixes with '/api' <-- look at app.use('/api', apiRoutes);
apiRoutes.get('/', function(req, res) {
  res.json({message: 'Welcome to the coolest API on earth!'});
});

// route to return all users (GET http://localhost:XXXX/api/users)
apiRoutes.get('/users', function(req, res) {
    userSrvc.listUser({data: mockedUserData, user: null}, function(err, users) {
        console.log('ERR ', err, ' USERS ', users);

        if(err) {
            res.json(err);
        } else {
            res.json(users);
        }
    });
});

apiRoutes.post('/findUser', function(req, res) {
    console.log('req.params ', req.params);
    res.json({message: 'Więc szukasz użytkowników?', user: req.body});
});

apiRoutes.post('/authenticate', function(req, res) {
    var login   = req.body.login,
        pass    = req.body.pswd,
        token;

    userSrvc.authenticate({data: mockedUserData, user: {login: login, pswd: pass}}, function(err, data) {

        if(err) {
            res.json({message: err});
        } else {
            if(data.success) {
                token = jwt.sign(login, app.get('superSecret'), {
                    expiresInMinutes: 1 // expires in 24 hours
                });

                res.json({success: data.success, userData: data.userData, message: data.message, token: token});
            } else {
                res.json({success: data.success, message: data.message});
            }
        }
    });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

app.listen(port, function() {
    console.log('Server listens at:', port);
});
