var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var q = require('q');
var mongoose = require('mongoose');

var Tag = require(path.join(__dirname, '../../model/tag'));
var Indicator = require(path.join(__dirname, '../../model/indicator'));

/* GET tag category by name */
router.get('/:ys/:it/:ss/:gr/:na/:ge', function(req, res) {
	var yrIds = req.params.ys.split(',');
	var itIds = req.params.it.split(',');
	var ssIds = req.params.ss.split(',');
	var grIds = req.params.gr.split(',');
	var naIds = req.params.na.split(',');
	var geIds = req.params.ge.split(',');

	Indicator.find({
		$and : [ {
			$or : _.map(yrIds, function(yrId) {
				return {
					_tags : new mongoose.Types.ObjectId(yrId)
				};
			})
		}, {
			$or : _.map(itIds, function(itId) {
				return {
					_tags : new mongoose.Types.ObjectId(itId)
				};
			})
		}, {
			$or : _.map(ssIds, function(ssId) {
				return {
					_tags : new mongoose.Types.ObjectId(ssId)
				};
			})
		}, {
			$or : _.map(grIds, function(grId) {
				return {
					_tags : new mongoose.Types.ObjectId(grId)
				};
			})
		}, {
			$or : _.map(naIds, function(naId) {
				return {
					_tags : new mongoose.Types.ObjectId(naId)
				};
			})
		}, {
			$or : _.map(geIds, function(geId) {
				return {
					_tags : new mongoose.Types.ObjectId(geId)
				};
			})
		} ]
	})//
	.then(function(data) {
		return q.nbind(Tag.populate, Tag)(data, '_tags');		
	})//
	.then(function(data) {
		// console.log(data);
		console.log(data.length);
		res.send(data);
		res.status(200).end();
	});
});

module.exports = router;
