var express = require('express');
var router = express.Router();
var User = require('../db/user');
var Blog = require('../db/demo-blog');
var revBlog = require('../db/revblog');
var Rev = require('../db/rev');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var escape = require('escape-html');
var serialize = require('node-serialize');
var cookie = require('cookie');
var moment = require('moment');


var loggedin = function(req,res,next) {
	if(req.isAuthenticated()) {
		next()
	} else {
		res.redirect('/login')
	}
}

router.get('/', loggedin, function(req, res, next) {
  res.render('admin', {name : ''});
});

router.post('/', loggedin, function(req, res, next) {
    Rev.find({ uname:req.session.passport.user.username , pass:req.body.pass}, function(err, obj){
      if(err){
        console.log(err);
      } else if(obj[0]){
        var profile1 = JSON.stringify({ 'user' : req.session.passport.user.username });
        var profile = Buffer.from(profile1).toString('base64');
      	res.cookie('profile', profile, { maxAge: 900000, httpOnly: true });

        res.redirect('/admin/dashboard');
      } else {
        res.render('admin', { name: "In-Valid"});
      }
    });
});

router.get('/dashboard', loggedin, function(req, res, next) {
  
  if (req.cookies.profile) {
   var str = new Buffer(req.cookies.profile, 'base64').toString();
   var obj = serialize.unserialize(str);
   if (obj.user) {
     res.render('adm-panel', { name: escape(obj.user)});
   }
 } else {
  res.redirect('/admin');
 } 
});

router.get('/review', loggedin, function(req, res, next) {

 if (req.cookies.profile) {
   var str = new Buffer(req.cookies.profile, 'base64').toString();
   var obj = serialize.unserialize(str);
   if (obj.user) {
    revBlog.find({}, function(err, data){
      if(!err && data) {
        res.render('adm-review', { item:data });
      }
    });
   }
 } else {
  res.redirect('/admin');
 } 

});

router.get('/uam', loggedin, function(req, res, next) {
 if (req.cookies.profile) {
   var str = new Buffer(req.cookies.profile, 'base64').toString();
   var obj = serialize.unserialize(str);
   if (obj.user) {
     User.find({}, function(err, data){
      if(!err && data) {
        //console.log(data);
        res.render('adm-uam', { item:data });
      }
     });
   }
 } else {
  res.redirect('/admin');
 } 
});

router.get('/uam-allow/:id', loggedin, function(req, res, next) {
 if (req.cookies.profile) {
   var str = new Buffer(req.cookies.profile, 'base64').toString();
   var obj = serialize.unserialize(str);
   if (obj.user) {
     var id = req.params.id;
     var dpass = 'password';
     User.find({_id:id}, function(err, data){
      if (!err && data) {
        console.log(data[0].username);
        var usrObj={
          uname: data[0].username,
          pass: dpass
        };
        Rev.create(usrObj, function(err, res){
          if (!err && res) {
            console.log('User created');
          } else {
            console.log(err);
          }
        });
        res.redirect('/admin/uam');
      } else {
        console.log(err);
      }
     });
     //Allow access by adding user to revblog
   }
 } else {
  res.redirect('/admin');
 } 
});

router.post('/uam-cp', loggedin, function(req, res, next) {
 if (req.cookies.profile) {
   var str = new Buffer(req.cookies.profile, 'base64').toString();
   var obj = serialize.unserialize(str);
   if (obj.user) {
      var id = req.body.item_id;
      var npass = req.body.newpass;
      var cnpass = req.body.cnwpass;
      //console.log(id);
      var result = npass.localeCompare(cnpass);
      //console.log(result);
      if (result == 0 ) {
        User.find({_id: id}, function(err, data){
          if (!err && data) {
            var uname = data[0].username;
            var usrObj = {
              uname: uname,
              pass: npass
            };
            Rev.updateOne({uname: uname}, usrObj, function(err, data){
              if (data.nModified > 0) {
                //console.log('Password Changed');
              } else {
                //console.log(err);
              }
            }); 
          }

        });
      }
      res.redirect('/admin/uam');
     //Change password by update password in revblog
   }
 } else {
  res.redirect('/admin');
 } 
});

router.get('/uam-revoke/:id', loggedin, function(req, res, next) {
 if (req.cookies.profile) {
   var str = new Buffer(req.cookies.profile, 'base64').toString();
   var obj = serialize.unserialize(str);
   if (obj.user) {
    var id = req.params.id;
    User.find({_id:id}, function(err, data){
      if (!err && data) {
        console.log(data[0].username);
        var user = data[0].username;
        Rev.remove({uname: user}, function(err, res){
          if (!err && res) {
            console.log('User Removed');
          } else {
            console.log(err);
          }
        });
        res.redirect('/admin/uam');
      } else {
        console.log(err);
      }
     });
     //Revoke access by deleting user from revblog
   }
 } else {
  res.redirect('/admin');
 } 
});

router.get('/view/:id', loggedin, function(req, res, next) {
  if (req.cookies.profile) {
   var str = new Buffer(req.cookies.profile, 'base64').toString();
   var obj = serialize.unserialize(str);
   if (obj.user) {
      var id = req.params.id;
      revBlog.find({_id: id} , function(err, data){
        if(!err && data){
          res.render('adm-view',{item: data});
        }
      });
    }
 } else {
  res.redirect('/admin');
 } 
});

router.get('/accept/:id', loggedin, function(req, res, next) {
  if (req.cookies.profile) {
   var str = new Buffer(req.cookies.profile, 'base64').toString();
   var obj = serialize.unserialize(str);
   if (obj.user) {
      var id = req.params.id;
      revBlog.find({_id: id} , function(err, data){
        if(!err && data){
          var blogObj = {
            title: data[0].title,
            text: data[0].text,
            owner: data[0].owner,
            date: data[0].date
          };
        //console.log(blogObj);
        Blog.create(blogObj, function(err, res){
          if(err){
            console.log(err);
            //string1 = "Error: Not Updated"
          } else {
              console.log(blogObj)
              //string1 = "Success: Updated"
            }
        });
        }
      });
      revBlog.remove({_id: id}, function(err, data){
        if (err) {
          console.log(err);
        } else {
          console.log('');
        }
      });
      res.redirect('/admin/review');
    }
 } else {
  res.redirect('/admin');
 } 
});

router.get('/reject/:id', loggedin, function(req, res, next) {
  if (req.cookies.profile) {
   var str = new Buffer(req.cookies.profile, 'base64').toString();
   var obj = serialize.unserialize(str);
   if (obj.user) {
      var id = req.params.id;
      revBlog.find({_id: id} , function(err, data){
        if(!err && data){
          revBlog.remove({_id: id}, function(err, data){
            if (err) {
              console.log(err);
            } else {
              console.log('');
            }
          });
        }
      });
      res.redirect('/admin/review');
    }
 } else {
  res.redirect('/admin');
 } 
});

module.exports = router;