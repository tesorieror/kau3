/**
 * Freshmen Post graduate college section specialization service
 * 
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var q = require('q');
var mongoose = require('mongoose');

var Tag = require(path.join(__dirname, '../../../model/tag'));
var Indicator = require(path.join(__dirname, '../../../model/indicator'));

function processParams(params) {
	function processParam(param) {
		return param == '*' ? [] : param.split(',');
	}
	return _.map(_.values(params), function(param) {
		return processParam(param);
	});
}

/* GET tag category by name */
// YR, SS, DS, SY, IN, IT, CO, SE, SP, NA, GE
router.get('/:ys/:ss/:ds/:sy/:it/:in/:co/:se/:sp/:na/:ge', function(req, res) {
	var idCollections = processParams(req.params);
	idCollections = _.filter(idCollections, function(idCollection) {
		return idCollection.length > 0;
	});
	console.log("Counting...");
	Indicator.count({
		$and : _.map(idCollections, function(idCollection) {
			return {
				$or : _.map(idCollection, function(id) {
					return {
						_tags : new mongoose.Types.ObjectId(id)
					};
				})
			};
		})
	})//
	.then(function(data) {
		console.log("DONE! ", data, " records!");
		res.send({
			count : data
		}).end();
	}, function(err) {
		res.send(500, err).end();
	});
});

module.exports = router;
