const UserModel = require('../models/user.model');
const passport = require('passport');
const _ = require('lodash');
const uuid = require('uuid');
const jsonwebtoken = require('jsonwebtoken');
const config = require('../config.json');

module.exports.signup = async (req, res) => {
    try {
        const newUser = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        });

        const user = await newUser.save()
        res.status(201).json({ user: user.toJSON(), token: user.generateJwt() });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
};

module.exports.userProfile = async (req, res, next) => {
    try {
        await UserModel.findOne({ _id: req._id }).then(user => {
            if (!user)
                res.status(404).json({ status: false, message: 'User record not found.' });
            else
                res.status(200).json({ status: true, user: _.pick(user, ['fullName']) });
        });
    }
    catch (err) {
        console.log(err);
    };
}

module.exports.authenticate = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return res.status(404).json(err);
        if (user) return res.status(200).json({ "token": user.generateJwt(), "user": user });
        else return res.status(401).json(info);
    })(req, res);
}

module.exports.refreshToken = (req, res, next) => {
    let token;
    if ('authorization' in req.headers)
        token = req.headers['authorization'].split(' ')[1];

    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    else {
        const refreshTokenValid = uuid.validate(req.query.refreshToken);
        if (refreshTokenValid) {
            const jwt = jsonwebtoken.sign({
                _id: jsonwebtoken.decode(token)._id
            }, config.jwt.secret,
                {
                    expiresIn: config.jwt.expiry
                });

            const refreshToken = uuid.v4();

            res.status(200).json({ jwt: jwt, refreshToken: refreshToken });
        } else return res.status(401).json({ message: "Invalid Refresh Token" });
    }
}