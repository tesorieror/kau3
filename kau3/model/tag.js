/**
 * Tag file
 */
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var q = require('q');

var TagCategory = require(path.join(__dirname, 'tag-category'));
var Tag;

var schema = mongoose.Schema({
	name : String,
	description : String,
	order : Number,
	_category : {
		type : mongoose.Schema.Types.ObjectId,
		ref : TagCategory
	},
	_tags : [ {
		type : mongoose.Schema.Types.ObjectId,
		ref : Tag
	} ]
});

schema.statics.findByCategoryIdStr = function(idStr) {
	// return Tag.find({
	// _category : new mongoose.Types.ObjectId(idStr)
	// });

	return Tag.find({
		_category : new mongoose.Types.ObjectId(idStr)
	}).then(function(tags) {
		return q.all(_.map(tags, function(tag) {
			return Tag.populate(tag, '_tags');
		}));
	});
};

module.exports = Tag = mongoose.model('Tag', schema);