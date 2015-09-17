/**
 * Students communities
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var q = require('q');
var mongoose = require('mongoose');

var Tag = require(path.join(__dirname, '../../../model/tag'));
var TagCategory = require(path.join(__dirname, '../../../model/tag-category'));
var Indicator = require(path.join(__dirname, '../../../model/indicator'));
var TagDependency = require(path.join(__dirname, '../../../model/tag-dependency'));

function processParams(params) {
	console.log('processParams');
	function processParam(param) {
		return param == '*' ? [] : param.split(',');
	}
	return _.map(_.values(params), function(param) {
		return processParam(param);
	});
}

function findIndicators(idCollections) {
	console.log('findIndicators');
	return Indicator.find({
		$and : _.map(idCollections, function(idCollection) {
			return {
				$or : _.map(idCollection, function(id) {
					return {
						_tags : new mongoose.Types.ObjectId(id)
					};
				})
			};
		})
	});
}

function populateIndicatorTags(indicators) {
	console.log('populateIndicatorTags');
	return Tag.populate(indicators, '_tags');
}

function getCategoryByName(name) {
	console.log('getCategoryByName');
	var result = TagCategory.findOne({
		name : name
	});//
	return result;
}

function getInstitutionTags(indicators) {
	console.log('getInstitutionTags');
	return getCategoryByName('IN')//
	.then(function(cat) {
		return _.map(indicators, function(indicator) {
			return _.detect(indicator._tags, function(tag) {
				return tag._category + "" == cat._id + "";// IN! do not forget!
			});
		});
	});
}

function populateInstitutionDependencies(institutionTags) {
	console.log('populateInstitutionDependencies');
	return TagDependency.populate(institutionTags, '_dependencies');
}

function populateInstitutionDependencyTags(institutionTags) {
	console.log('populateInstitutionDependencyTags');
	return q.all(_.flatten(_.map(institutionTags, function(institutionTag) {
		return _.map(institutionTag._dependencies, function(dep) {
			return Tag.populate(dep, '_tags');
		});
	}))).then(function(deps) {
		return institutionTags;
	});
}

function getDependencyTags(tag) {
//	console.log('getDependencyTags');
	// console.log('[getDependencyTags] tag:', tag);
	// console.log('[getDependencyTags] tag._dependencies.length:',
	// tag._dependencies.length);
	var result = _.flatten(_.map(tag._dependencies, function(dep) {
		// console.log('[getDependencyTags] dep._tags.length:', dep._tags.length);
		return dep._tags;
	}));

	// if (result.length > 0) {
	// console.log('getDependencyTags:', result);
	// } else {
	// // console.log('getDependencyTags');
	// }
	return result;
}

function getInstitutionTypeTags(institutionTags) {
	// console.log(institutionTags);
	console.log('getInstitutionTypeTags');
	return getCategoryByName('IT')//
	.then(function(cat) {
		return Tag.populate(cat, '_tags');
	})//
	.then(function(itCat) {
		// console.log("ITCAT", itCat);
		console.log("InstitutionTags length", institutionTags.length);
		return _.map(institutionTags, function(inTag) {
			return _.detect(getDependencyTags(inTag), function(t) {
				// if (t._category + '' == itCat._id + '') {
				// console.log("TAG", t)
				// } else {
				// console.log(t._category, itCat._id);
				// }
				return t._category + '' == itCat._id + '';
			});
		});
	});
}

function addInstitutionTypeTag(indicators) {
	console.log('addInstitutionTypeTag');
	return getInstitutionTags(indicators)//
	.then(populateInstitutionDependencies)//
	.then(populateInstitutionDependencyTags)//
	.then(getInstitutionTypeTags)//
	.then(function(institutionTypeTags) {
		// console.log(institutionTypeTags);
		var i = 0;
		_.each(institutionTypeTags, function(itTag) {
			indicators[i]._tags.push(itTag);
			i++;
		});
		return indicators;
	});
}

/* GET tag category by name */
router.get('/:ys/:it/:in/:cc/:pe/:ge', function(req, res) {
	// Patch to avoid it and in in the query (all defined by cc)

	var patchedParams = req.params;
	delete patchedParams.it;
//	delete patchedParams["in"];
	console.log("Params", patchedParams);

	var idCollections = processParams(patchedParams);
	idCollections = _.filter(idCollections, function(idCollection) {
		return idCollection.length > 0;
	});
	// console.log("idCollections", idCollections);
	findIndicators(idCollections)//
	.then(populateIndicatorTags)//
	.then(addInstitutionTypeTag)//
	.then(function(data) {
		console.info("Request completed!");
		// console.log(data);
		res.status(200).send(data).end();
	}, function(err) {
		console.error(err);
		res.status(500).send(err).end();
	});
});

module.exports = router;
