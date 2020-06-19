var mongoose = require('mongoose');

var schema = mongoose.Schema;

var revBlogSchema = new schema({
	title: {
		type: String,
		require: true
	},
	text: {
		type: String,
		require: true
	},
	date: {
		type: Date,
		require: true
	},
	owner: {
		type: String,
		require: true
	}
});

module.exports = mongoose.model('revblogs', revBlogSchema, 'revblog');