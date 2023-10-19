const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registration process
const register = (req, res, next) => {
    var userName = req.body.userName;

    User.findOne({ userName: userName })
        .then(user => {
            if (user) {
                return res.json({
                    message: "User already exists!"
                });
            } else {
                bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
                    if (err) {
                        return res.json({
                            error: err
                        });
                    }

                    let user = new User({
                        userName: req.body.userName,
                        password: hashedPass
                    });

                    user.save()
                        .then(user => {
                            return res.json({
                                message: 'User Added Successfully!'
                            });
                        })
                        .catch(error => {
                            return res.json({
                                message: 'An error occurred!'
                            });
                        });
                });
            }
        });
}

// Login process
const login = (req, res, next) => {
    var userName = req.body.userName;
    var password = req.body.password;

    User.findOne({ userName: userName })
        .then(user => {
            if (!user) {
                return res.json({
                    message: "No such user found!"
                });
            }

            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    return res.json({
                        error: err
                    });
                }
                if (result) {
                    let token = jwt.sign({ userName: user.userName }, 'verySecretValue', { expiresIn: '1h' });
                    return res.json({
                        message: 'Login successful!',
                        token
                    });
                } else {
                    return res.json({
                        message: 'Password does not match!'
                    });
                }
            });
        });
}

module.exports = {
    register,
    login
};
