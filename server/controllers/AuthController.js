const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Registration process
const register = (req, res, next) => {
    var userName = req.body.userName

    User.findOne({userName: userName})
    .then(user => {
        if(user)
        {
            res.json({
                message: "User already exists!"
            })
        } else {
            bcrypt.hash(req.body.password, 10, function(err, hashedPass){
                if(err)
                {
                    res.json({
                        error: err
                    })
                }

                let user = new User({
                    userName: req.body.userName,
                    password: hashedPass
                })
            
                user.save()
                .then(user =>{
                    res.json({
                        message: 'User Added Successfully!'
                    })
                })
            
                .catch(error => {
                    res.json({
                        message: 'An error occured!'
                    })
                })
            })
        }
    });

    


}

// Login process
const login = (req, res, next) => {
    var userName = req.body.userName
    var password = req.body.password

    User.findOne({userName: userName})
    .then(user => {
        if(user)
        {
            bcrypt.compare(password, user.password, function(err,result){
                if(err)
                {
                    res.json({
                        error: err
                    })
                }
                if(result){
                    let token = jwt.sign({userName: user.userName}, 'verySecretValue', {expiresIn: '1h'})
                    res.json({
                        message: 'Login successful!',
                        token
                    })
                }
                else
                {
                    res.json({
                        message: 'Password does not match!'
                    })
                }
            })
        }
        else
        {
            res.json({
                message: "No such user found!"
            })
        }
    })
}

module.exports = {
    register, login
}