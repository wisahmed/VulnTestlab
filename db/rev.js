//Rev.js
var mongoose = require('mongoose');

var schema = mongoose.Schema;

var revSchema = new schema({
	uname: {
		type: String,
		require: true
	},
	pass: {
		type: String,
		require: true
	}
});

module.exports = mongoose.model('revs', revSchema, 'rev');