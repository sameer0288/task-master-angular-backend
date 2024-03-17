const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const userController = require('./controllers/user.controller');
const todoController = require('./controllers/todo.controller');
const jwtHelper = require('./jwtHelper');
require('./db');
require('./passportConfig');

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());
app.listen(3000, () => {
    console.log('Server running at port 3000...');
});

app.use(passport.initialize());

app.post('/api/user/authenticate', userController.authenticate);
app.post('/api/user/signup', userController.signup);
app.get('/api/user/userProfile', jwtHelper.verifyJwtToken, userController.userProfile);
app.get('/api/user/refreshToken', userController.refreshToken);

app.use('/api/todo', jwtHelper.verifyJwtToken, todoController);

app.get('/', (req, res) => {
    res.send("<h2> Welcome to ToDo application's Backend </h2>");
});

app.get('*', (req, res) => {
    res.redirect('/');
});