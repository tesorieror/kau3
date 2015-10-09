/**
 * Tag Category file
 */
var path = require('path');
var mongoose = require('mongoose');

var Tag = require(path.join(__dirname, 'tag'));

var TagCategory;

var schema = mongoose.Schema({
	name : String,
	description : String,
	tags : [ {
		type : String,
		ref : Tag
	} ]
});

module.exports = TagCategory = mongoose.model('TagCategory', schema);