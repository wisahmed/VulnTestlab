var ejs = require('ejs');
var express = require('express');
var router = express.Router();
var User = require('../db/user');
var Blog = require('../db/demo-blog');
var revBlog = require('../db/revblog');
var Rev = require('../db/rev');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var loggedin = function(req,res,next) {
	if(req.isAuthenticated()) {
		next()
	} else {
		res.redirect('/login')
	}
}

/* GET home page. */
router.get('/', loggedin, function(req, res, next) {
	var username = req.session.passport.user.username;
	User.find({username: username }, function(error, user) {
		res.render('index', { name: user[0].name });
	})
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/profile', loggedin, function(req, res, next) {
  var username = req.session.passport.user.username;
  User.find({username: username }, function(error, user) {
    var name = user[0].name;
    var headline =user[0].headline;
    var about = user[0].about;
    var hobbies = user[0].hobbies;

    res.render('profile', {display:'', name: name, headline: headline, about: about, hobbies: hobbies});
  })
});

router.post('/profile', loggedin, function(req, res, next) {
  
  var userObj = {
    username: req.session.passport.user.username,
    password: req.session.passport.user.password,
    name: req.body.name,
    headline: req.body.headline,
    about: req.body.about,
    hobbies: req.body.hobbies
  };

  User.updateOne({username: userObj.username}, userObj, function(err, data){
    if(!err){
      if(data.nModified > 0) {
        res.render('page31', {display: "Update Completed"})
      } else {
        res.render('page31', {display: "Not Modified"})
      }
    } else {
      res.render('page32', {display: "Update Failed"})
    }
  });

});

router.get('/page3', loggedin, function(req, res, next) {
  
  res.render('page3', { name : '' })
});

router.post('/page3' ,loggedin, function(req, res, next) {
  //res.render('page31', {display: "Update Completed"});
  var topic = req.body.topic;
  var story = req.body.story;
  //var id = get_id();
  var owner = req.session.passport.user.username;
  var date = new Date(Date.now()).toISOString();

  var string1 = ''

  var blogObj = {
    title: topic,
    text: story,
    owner: owner,
    date: date
  };

  revBlog.create(blogObj, function(err, res){
    if(err){
      string1 = "Error: Not Updated"
    } else {
        console.log(blogObj)
        string1 = "Success: Updated"
      }
  });
  //var string1 = '<script>alert("'+topic+'\n'+story+'");</script>'
  res.render('page3', { name : string1 })
});

router.post('/search' ,loggedin, function(req, res, next) {
  
  var search = req.body.search;
  var query = {$or: [{'text': { $regex: search ,$options: 'i' }}, {'title': { $regex: search ,$options: 'i' }}]}
  var temp = [];
  Blog.find(query,function(err, doc){
    if(!err)
      {
        temp = doc;
        var _test = getHTML(search, temp);
        res.send(_test);
      } else {
        console.log(err);
      }
  });

  function getHTML(input, temp){
    //console.log(input);
    var template =`<!DOCTYPE html>
    <html lang="en">
    <head>
          <title>Vulnerabilty Test Lab</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
          
          <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css" rel="stylesheet">
        <style>
            body    { padding:50px; }
        </style>
    </head>
    <body class="container">

    <header>
        <nav class="navbar navbar-default">
          <div class="container-fluid">
            <div class="navbar-header">
              <a class="navbar-brand" href="#">VulnTestlab</a>
            </div>
            <ul class="nav navbar-nav">
              <li><a href="/">Home</a></li>
              <li><a href="/profile">Profile</a></li>
              <li><a href="/page3">Submission Platform</a></li>
              <li><a href="/admin">Administration Platform</a></li>
            </ul>
            <form class="navbar-form navbar-left" action="/search" method="POST">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Search" name="search" value="">
                <div class="input-group-btn">
                  <button class="btn btn-default" type="submit">
                    <i class="glyphicon glyphicon-search"></i>
                  </button>
                </div>
              </div>
            </form>
            <ul class="nav navbar-nav navbar-left">
              <li><a href="/logout">Logout</a></li>
            </ul>
          </div>
        </nav>
    </header>

    <main>
        <div class="jumbotron">
            <h1>Search results for `+input+`</h1>
            <p>Nothing to search here really</p>
            <div>
            <div class="row mb-2">
              <% temp.forEach(function(item){%>
                <div class="col-md-6" style="margin-top:10px;">
                  <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative" style="width:450px; background:white;border-radius: 25px;" onmouseover="this.style.background='Gainsboro';" onmouseout="this.style.background='white'">
                    <div class="col p-4 d-flex flex-column position-static" style="margin-right: 10px; margin-left: 15px;bottom-padding: 20px;">
                      <h3 class="mb-0"><%= item.title %></h3>
                      <div class="mb-1 text-muted"><%= item.date %></div>
                      <p class="card-text mb-auto"><%= item.text.substring(0, 150) %></p>
                      <a href="../view/<%= item._id %>" class="stretched-link">Continue reading</a>
                    </div>
                  </div>
                </div>
              <% });%>
            </div>
            </div>
        </div>
    </main>

    <footer>
        <p class="text-center text-muted">© Copyright 2014 The Awesome People</p>
    </footer>

    </body>
    </html>`
    var html =ejs.render(template,{ name: "Venus", temp: temp })
    return html;
  }
  
  
  //res.send(_test);

});

router.get('/search', loggedin, function(req, res, next) {
  res.render('index2', {name: ''});
});

router.get('/view/:id', loggedin, function(req, res, next) {
  var id = req.params.id;
  
  query = {'_id': id }
  Blog.findOne(query, function(err, object){
    res.render('view', {item : object})
  });

  //res.render('view', {name: id});
});

/*router.get('/page4', loggedin, function(req, res, next) {
  res.render('page4', {display: 'View.ejs'});
});*/

/*router.post('/page4', loggedin, function(req, res, next) {
  var message = 'Changes Updated' ;
    res.render('page31', {display: message});
});*/

router.get('/logout', function(req,res){
   res.clearCookie('profile');
	 req.logout();
	 res.redirect('/')
})

module.exports = router;
