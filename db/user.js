var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema;

var userSchema = new schema({
	name: {
		type: String,
		require: true
	},
	username: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	headline: {
		type: String,
		require: true
	},
	about: {
		type: String,
		require: true
	},
	hobbies: {
		type: String,
		require: true
	}
});

 userSchema.methods.hashPass = function(password) {
 	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
 };

 userSchema.methods.cmpPass = function(password, hash) {
 	return bcrypt.compareSync(password, hash);
 };

module.exports = mongoose.model('users', userSchema, 'login');