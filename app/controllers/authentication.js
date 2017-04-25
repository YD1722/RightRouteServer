var jwt = require('jsonwebtoken');  
var User = require('../models/user');
var authConfig = require('../../config/auth');  // auth.js contain the secret 


function generateToken(user){
	return jwt.sign(user,authConfig.secret,{
		expiresIn:10080
	})
}

function setUserInfo(request){
    return {
        _id: request._id,
        email: request.email,
        username: request.user_name,
        role: request.role
    };
}

exports.login = function(req, res, next){
 
    var userInfo = setUserInfo(req.user);
    // `req.user` contains the authenticated user.
 
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    }); 
}

//this is not necessaty for RRAdmin 
exports.register = function(req, res, next){
 
    var email = req.body.email;
    var username= req.body.username;
    var password = req.body.password;
    var role = req.body.role;
 
    if(!email){
        return res.status(422).send({error: 'You must enter an email address'});
    }
 
    if(!password){
        return res.status(422).send({error: 'You must enter a password'});
    }

    if(!username){
        return res.status(422).send({error: 'You must enter a username'});
    }


 
    /*User.findOne({email: email}, function(err, existingUser){
 
        if(err){
            return next(err);
        }
 
        if(existingUser){
            return res.status(422).send({error: 'That email address is already in use'});
        }
 
        var user = new User({
            email: email,
            username:username,
            password: password,
            role: role
        });
 
        user.save(function(err, user){
 
            if(err){
                return next(err);
            }
 
            var userInfo = setUserInfo(user);
 
            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            })
 
        });
 
    }); */
    let user = new User({
            email: email,
            username:username,
            password: password,
            role: role
    });
    user.save((err,user)=>{
        if(err){
            if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(500).json(
                { success: false, 
                message: 'User already exist!' }
                );
        }
        // other errors 
        return res.status(503).json(err);
        }
        var userInfo = setUserInfo(user);
        res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
        });
    });
}

exports.roleAuthorization = function(roles){
 
    return function(req, res, next){
 
        var user = req.user;
 
        User.findById(user._id, function(err, foundUser){
 
            if(err){
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }
 
            if(roles.indexOf(foundUser.role) > -1){
                return next();
            }
 
            res.status(401).json({error: 'Sorry! You are not authorized to view this content'});
            return next('Unauthorized');
 
        });
 
    }
}


