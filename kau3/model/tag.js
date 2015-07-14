/**
 * Tag file
 */
var path = require('path');
var mongoose = require('mongoose');

var TagCategory = require(path.join(__dirname, 'tag-category'));
var Tag;

var schema = mongoose.Schema({
	name : String,
	description : String,
	order : Number,
	_category : {
		type : mongoose.Schema.Types.ObjectId,
		ref : TagCategory
	}
});

schema.statics.findByCategoryIdStr = function(idStr) {
	return Tag.find({
		_category : new mongoose.Types.ObjectId(idStr)
	});
};

module.exports = Tag = mongoose.model('Tag', schema);