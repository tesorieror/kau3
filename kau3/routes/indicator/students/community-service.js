/**
 * Students community service 
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
router.get('/:ys/:ccs/:pe/:ge', function(req, res) {
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
		res.status(200).send(data).end();
	}, function(err) {
		res.status(500).send(err).end();
	});
});

module.exports = router;
