var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var q = require('q');

var TagCategory = require(path.join(__dirname, '../model/tag-category'));
var Tag = require(path.join(__dirname, '../model/tag'));
var TagDependency = require(path.join(__dirname, '../model/tag-dependency'));
var Indicator = require(path.join(__dirname, '../model/indicator'));

/* GET initialize */
router.get('/', function(req, res) {

	var plainTagCategories;
	var plainTags = [];
	var plainIndicators = [];

	// keys [category.name][tag.name]
	var tagDictionary = [];

	function setPlainTagCategories(categories) {
		console.log("Setting plain tag categories");
		plainTagCategories = categories;
		return categories;
	}

	function addPlainTags(tags) {
		console.log("Adding plain tags");
		plainTags = plainTags.concat(tags);
		return plainTags;
	}

	function addPlainIndicators(indicators) {
		console.log("Adding plain indicators");
		plainIndicators = plainIndicators.concat(indicators);
		return indicators;
	}

	function sendData(data) {
		console.log("Sending data");
		var result = data;
		res.status(200).send(result).end();
	}

	function sendError(err) {
		console.error("Sending errors");
		res.status(500).send(err).end();
	}

	function dataAt(n) {
		return function(data) {
			return data[n];
		};
	}

	function myError() {
		var deferred = q.defer();

		setTimeout(function() {

			deferred.reject("My Error");
			console.error("MY ERROR");
			// try {
			// throw new Error("my error");
			// } catch (err) {
			// deferred.reject(err);
			// }
		}, 2000);
		console.log("after timeout");
		return deferred.promise;
	}

	function removeAll(data) {
		console.log("Removing data");
		return q.all([ TagCategory.remove(), Tag.remove(), Indicator.remove() ]);
	}

	function loadData(data) {
		console.log("Loading data");
		return q
				.all([
						/**
						 * Tag Categories
						 */
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-category.json'), 'utf-8').then(JSON.parse).then(
								setPlainTagCategories),
						/**
						 * Tags
						 */
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-al.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-cc.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-ccs.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-ge.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-gr.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-in.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-it.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-na.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-pe.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-ss.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-up.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-yr.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-ds.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-sy.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-co.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-se.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
						q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-sp.json'), 'utf-8').then(JSON.parse).then(
								addPlainTags),
				/**
				 * Indicators
				 */

				//
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1434-1435-indicator_1-1.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1433-1434-indicator_1-1.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1432-1433-indicator_1-1.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1431-1432-indicator_1-1.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1430-1431-indicator_1-1.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1429-1430-indicator_1-1.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1428-1429-indicator_1-1.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1427-1428-indicator_1-1.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1426-1427-indicator_1-1.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1425-1426-indicator_1-1.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1434-1435-indicator_1-2.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1433-1434-indicator_1-2.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1432-1433-indicator_1-2.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1431-1432-indicator_1-2.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1430-1431-indicator_1-2.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1429-1430-indicator_1-2.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1428-1429-indicator_1-2.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1427-1428-indicator_1-2.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1426-1427-indicator_1-2.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1425-1426-indicator_1-2.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1434-1435-indicator_1-5.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1433-1434-indicator_1-5.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1432-1433-indicator_1-5.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1431-1432-indicator_1-5.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1430-1431-indicator_1-5.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1429-1430-indicator_1-5.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1428-1429-indicator_1-5.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1427-1428-indicator_1-5.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1426-1427-indicator_1-5.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1425-1426-indicator_1-5.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1434-1435-indicator_1-6.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1433-1434-indicator_1-6.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1432-1433-indicator_1-6.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1431-1432-indicator_1-6.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1430-1431-indicator_1-6.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1429-1430-indicator_1-6.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1428-1429-indicator_1-6.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1427-1428-indicator_1-6.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1426-1427-indicator_1-6.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1425-1426-indicator_1-6.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1434-1435-indicator_1-8.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1433-1434-indicator_1-8.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1432-1433-indicator_1-8.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1431-1432-indicator_1-8.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1430-1431-indicator_1-8.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1429-1430-indicator_1-8.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1428-1429-indicator_1-8.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1427-1428-indicator_1-8.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1426-1427-indicator_1-8.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)
				// (
				// path.join(__dirname,
				// '../data/1425-1426-indicator_1-8.json'), 'utf-8')
				// .then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)(
				// path.join(__dirname, '../data/1434-1435-indicator_2-4.json'),
				// 'utf-8').then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)(
				// path.join(__dirname, '../data/1434-1435-indicator_2-7.json'),
				// 'utf-8').then(JSON.parse).then(addPlainIndicators),
				// q.nfbind(fs.readFile)(
				// path.join(__dirname, '../data/1434-1435-indicator_2-13.json'),
				// 'utf-8').then(JSON.parse).then(addPlainIndicators)
				]);

	}

	function insertTagCategories(data) {
		console.log("Inserting tag categories");
		return q.nbind(TagCategory.collection.insert, TagCategory.collection)(plainTagCategories);
	}

	function insertTags(data) {
		console.log("Inserting tags");
		var tags = _.map(plainTags, function(tag) {
			return q.nbind(TagCategory.findOne, TagCategory)({
				name : tag.category
			}).then(function(category) {
				return {
					name : tag.name,
					description : tag.description,
					order : tag.order,
					_tags : [],
					_category : category._id
				};
			});
		});

		return q.all(tags).then(function(tags) {
			var arrays = [];
			while (tags.length > 0) {
				arrays.push(tags.splice(0, 1000));
			}
			return q.all(_.map(arrays, function(a) {
				return q.nbind(Tag.collection.insert, Tag.collection)(a);
			}));
		});
	}

	function updateTagDependencies(data) {
		console.log("Updating tags");
		return q.all(_.map(plainTags, function(plainTag) {
			tagDictionary[plainTag.category][plainTag.name]._dependencies = [];
			return q.all(_.map(plainTag.tags, function(dependency) {
				return new TagDependency({
					_tags : _.map(dependency, function(tag) {
						return tagDictionary[tag.category][tag.tag];
					})
				}).save().then(function(dep) {
					// console.log('DEP', dep);
					tagDictionary[plainTag.category][plainTag.name]._dependencies.push(dep);
					return dep;
				});
			})).then(function(deps) {
				return tagDictionary[plainTag.category][plainTag.name].save().then(function(tag) {
					return tag;
				}, function(err) {
					console.error(plainTag.category, plainTag.name);
					console.error(err);
				});
			});//
		}));
	}

	function updateTagCategoryTags(data) {
		console.log("Updating tag categories");
		return q.all(TagCategory.find()//
		.then(function(categoryTags) {
			return _.map(categoryTags, function(categoryTag) {
				return q.nbind(Tag.find, Tag)({
					_category : categoryTag._id
				})//
				.then(function(tags) {
					categoryTag._tags = tags;
					return categoryTag.save();
				});
			});
		}));
	}

	function createTagDictionary() {
		console.log("Creating tag dictionary");
		return q.nbind(TagCategory.find, TagCategory)()//
		.then(function(tagCategories) {
			return q.nbind(Tag.populate, Tag)(tagCategories, {
				path : '_tags'
			});
		})//
		.then(function(tagCategories) {
			_.each(tagCategories, function(tc) {
				tagDictionary[tc.name] = _.indexBy(tc._tags, 'name');
			});
			return tagDictionary;
		});
	}

	function insertIndicators() {
		console.log("Inserting indicators");
		var indicators = _.map(plainIndicators, function(indicator) {
			return {
				value : indicator.value,
				_tags : _.map(indicator.tags, function(tag) {
					return tagDictionary[tag.category][tag.name]._id;
				})
			};
		});

		var arrays = [];
		while (indicators.length > 0) {
			arrays.push(indicators.splice(0, 1000));
		}
		return (q.all(_.map(arrays, function(a) {
			return q.nbind(Indicator.collection.insert, Indicator.collection)(a);
		})));
	}

	function onFulfilled(data) {
		console.info("Filfilled ");
		sendData(data);
		return data;
	}

	function onRejection(param) {
		console.error("Rejection", param);
		console.error("Unhandled reasons", q.getUnhandledReasons())
		sendError(param);
		return param;
	}

	function onProgress(param) {
		console.log(param);
		return param;
	}

	removeAll()//
	.then(loadData)//
	.then(insertTagCategories)//
	.then(insertTags)//
	.then(updateTagCategoryTags)//
	.then(createTagDictionary)//
	.then(updateTagDependencies)//
	.then(insertIndicators)//
	.done(onFulfilled, onRejection, onProgress);
});

module.exports = router;
