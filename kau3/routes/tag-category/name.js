var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var q = require('q');

var TagCategory = require(path.join(__dirname, '../../model/tag-category'));
var Tag = require(path.join(__dirname, '../../model/tag'));
var TagDependency = require(path.join(__dirname, '../../model/tag-dependency'));

/* GET tag category by name */
router.get('/:names', function(req, res) {

	var result;

	function loadTagCategoriesFor(names) {
		return q.all(_.map(names, function(n) {
			return TagCategory.find({
				'name' : n
			});
		}));
	}

	function populateTags(tagCategories) {
		return q.all(_.map(tagCategories, function(tc) {
			return Tag.populate(tc, '_tags');
		}));
	}

	function sendData(data) {
		// console.log("sendData", data);
		// console.log(data);
		res.send(data);
		res.status(200).end();
	}

	function sendError(err) {
		// console.error("sendError", err);
		res.send(err);
		res.status(500).end();
	}

	function populateTagDependencies(data) {
//		console.log('populate tag dependences');
		var categories = _.flatten(data);
		var promises = [];
		_.each(categories, function(cat) {
			_.each(cat._tags, function(tag) {
				promises.push(Tag.populate(tag, '_tags'));
				promises.push(TagDependency.populate(tag, '_dependencies').then(function(tag) {
					// console.log("DEP", tag._dependencies);
					return q.all(_.map(tag._dependencies, function(dep) {
						return (Tag.populate(dep, '_tags'));
					}));
				}));
			});
		});
		return q.all(promises).then(function(data) {
			// console.log("D",data);
			return categories;
		});
	}

	var names = req.params.names.split(',');

	loadTagCategoriesFor(names)//
	.then(populateTags)//
	.then(populateTagDependencies)//
	.then(sendData, sendError);
});

// return q.nbind(Tag.populate, Tag)(tag, '_tags');

module.exports = router;
