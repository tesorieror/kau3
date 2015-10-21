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
	category : {
		type : String,
		ref : 'TagCategory'
	},
	dependencies : [ {
		tags : [ {
			tag : String,
			ref : 'Tag'
		} ]
	} ]
});

// schema.statics.findByCategoryIdStr = function(idStr) {
// return Tag.find({
// _category : new mongoose.Types.ObjectId(idStr)
// }).then(function(tags) {
// return q.all(_.map(tags, function(tag) {
// return q.nbind(TagDependency.populate, TagDependency)(tag, '_dependencies');
// // return TagDependency.populate(tag, '_dependencies').then(function(data)
// // {
// // if (tag.name == "KSU") {
// // console.log("KSU", data);
// // }
// // });
// }));
// });
// };

module.exports = Tag = mongoose.model('Tag', schema);