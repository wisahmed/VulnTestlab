var localStrategy = require('passport-local').Strategy;
var User = require('./db/user');

module.exports = function (passport) {
	passport.serializeUser(function(user, done){
		done(null, user)
	});

	passport.deserializeUser(function(user, done){
		done(null, user) 
	});

	passport.use(new localStrategy(function(username, password, done){
		User.findOne({username: username}, function(err, doc){
			if(err) {
				done(null, false)
			} else {
				if (doc) {
					var valid = doc.cmpPass(password,doc.password);
					if (valid) {
						done(null,doc)
					}
				} else {
					done(null, false)
				}
			}
		});
		//console.log(username, password); 
	}))
}