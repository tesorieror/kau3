/**
 * Tag Dependency file
 */
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var q = require('q');

var Tag = require(path.join(__dirname, 'tag'));
var TagDependency;

var schema = mongoose.Schema({
	_tags : [ {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Tag'
	} ]
});

module.exports = TagDependency = mongoose.model('TagDependency', schema);