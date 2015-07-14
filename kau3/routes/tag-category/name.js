var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var q = require('q');

var TagCategory = require(path.join(__dirname, '../../model/tag-category'));
var Tag = require(path.join(__dirname, '../../model/tag'));

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
		res.send(_.flatten(data));
		res.status(200).end();
	}

	function sendError(err) {
		// console.error("sendError", err);
		res.send(err);
		res.status(500).end();
	}

	var names = req.params.names.split(',');

	loadTagCategoriesFor(names)//
	.then(populateTags)//
	.then(sendData, sendError);
});

module.exports = router;
