var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var q = require('q');
var mongoose = require('mongoose');

var Tag = require(path.join(__dirname, '../../model/tag'));
var Indicator = require(path.join(__dirname, '../../model/indicator'));

function processParams(params) {
	function processParam(param) {
		return param == '*' ? [] : param.split(',');
	}
	return _.map(_.values(params), function(param) {
		return processParam(param);
	});
}

/* GET tag category by name */
// router.get('/:ys/:it/:ins/:ss/:gr/:na/:ge', function(req, res) {
router.get('/:ys/:it/:ss/:gr/:na/:ge', function(req, res) {
	var idCollections = processParams(req.params);
	idCollections = _.filter(idCollections, function(idCollection) {
		return idCollection.length > 0;
	});

	// console.log("idCollections", idCollections);

	Indicator.find({
		$and : _.map(idCollections, function(idCollection) {
			return {
				$or : _.map(idCollection, function(id) {
					return {
						_tags : new mongoose.Types.ObjectId(id)
					};
				})
			};
		})
	}).then(function(data) {
		return q.nbind(Tag.populate, Tag)(data, '_tags');
	})//
	.then(function(data) {
		// console.log(data);
		// console.log(data.length);
		setTimeout(function(res, data) {
			res.send(data);
			res.status(200).end();
		}, 5000, res, data);
		// res.send(data);
		// res.status(200).end();
	});
});

module.exports = router;
