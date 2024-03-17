const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const config = require('../config.json');
const { v4 } = require('uuid');

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'Full name cannot be empty'
    },
    email: {
        type: String,
        required: 'Email cannot be empty',
        unique: true
    },
    password: {
        type: String,
        required: 'Password cannot be empty',
        minlength: [8, 'Password must be at least 8 characters long']
    },
    saltSecret: String,

    todoList: {
        type: mongoose.SchemaTypes.Array,
        default: [],
    }
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,13}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

userSchema.methods.generateJwt = function () {
    const jwt = jsonwebtoken.sign({
        _id: this._id
    }, config.jwt.secret,
        {
            expiresIn: config.jwt.expiry
        });

    const refreshToken = v4();

    return ({ jwt: jwt, refreshToken: refreshToken });
}

userSchema.methods.verifyPassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});

module.exports = mongoose.model('User', userSchema, 'Users');