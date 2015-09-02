var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var q = require('q');

var Tag = require(path.join(__dirname, '../../model/tag'));

/* GET tag category by name */
router.get('/:category', function(req, res) {

	// var categories = req.params.categories.split(',');

	// var promises = _.map(categories, function(c) {
	// return Tag.findByCategoryIdStr(c);
	// });

	function sendData(data) {
		console.log(data);
		var result = data;
		res.status(200).send(result).end();
	}

	function sendError(err) {
		res.status(500).send(err).end();
	}

	// q.all(promises).then(sendData, sendError);
	var c = req.params.category;
	console.log("category id", c);
	Tag.findByCategoryIdStr(c).then(sendData, sendError);

});

module.exports = router;
