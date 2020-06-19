//demo-blog.js
var mongoose = require('mongoose');

var schema = mongoose.Schema;

var blogSchema = new schema({
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

module.exports = mongoose.model('blogs', blogSchema, 'blog');