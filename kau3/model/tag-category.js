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
	_tags : [ {
		type : mongoose.Schema.Types.ObjectId,
		ref : Tag
	} ]
});

module.exports = TagCategory = mongoose.model('TagCategory', schema);