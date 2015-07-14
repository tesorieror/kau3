var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var q = require('q');

var Tag = require(path.join(__dirname, '../../model/tag'));

/* GET tag category by name */
router.get('/:categories', function(req, res) {

	var categories = req.params.categories.split(',');

	var promises = _.map(categories, function(c) {
		return Tag.findByCategoryIdStr(c);
	});

	function sendData(data) {
		// var result = {};
		// for (i = 0; i < categories.length; i++) {
		// result[categories[i]] = data[i];
		// }
		var result = data;
		res.send(result);
		res.status(200).end();
	}

	function sendError(err) {
		res.send(err);
		res.status(500).end();
	}

	q.all(promises).then(sendData, sendError);
});

module.exports = router;
