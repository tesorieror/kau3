/**
 * Tag file
 */
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var q = require('q');

var TagCategory = require(path.join(__dirname, 'tag-category'));
var TagDependency = require(path.join(__dirname, 'tag-dependency'));
var Tag;

var schema = mongoose.Schema({
	name : String,
	description : String,
	order : Number,
	_category : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'TagCategory'
	},
	_dependencies : [ {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'TagDependency'
	} ]
});

schema.statics.findByCategoryIdStr = function(idStr) {
	return Tag.find({
		_category : new mongoose.Types.ObjectId(idStr)
	}).then(
			function(tags) {
				return q.all(_.map(tags, function(tag) {
					return q.nbind(TagDependency.populate, TagDependency)(tag,
							'_dependencies');
				}));
			});
};

module.exports = Tag = mongoose.model('Tag', schema);