var express = require('express');
var User = require('../db/user');
var router = express.Router();


module.exports = function(passport){

  router.post('/register', function(req, res){
    
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password1;
    var password2 = req.body.password2;

    var result = password.localeCompare(password2);
    if (result == 0) {
      User.findOne({username: username}, function(err, doc){
        if (err) {
           res.status(500).send('Error Occured');
        } else {
          if (doc) {
            res.status(500).send('Username Already Exists ');
          }
          else {
            var record = new User();
            record.username = username;
            record.name = name;
            record.password = record.hashPass(password);
            record.save(function(err,user){
              if(err) {
                res.status(500).send('Username Already Exists ');
              } else {
                res.send(user);
              }
            })
          }
        }
      })
    } else {
    res.status(500).send('Password Mismatch'); 
    }
  });

	router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/',
    }), function (req, res) {
        res.send('hey')
    })

	return router;
};