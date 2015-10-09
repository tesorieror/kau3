/**
 * Tag file
 */
var path = require('path');
var mongoose = require('mongoose');

var Tag = require(path.join(__dirname, 'tag'));
var Indicator = require(path.join(__dirname, 'indicator'));

var schema = mongoose.Schema({
	value : Number,
	tags : [ {
		type : String,
		ref : 'Tag'
	} ]
});

var Indicator;

module.exports = Indicator = mongoose.model('Indicator', schema);