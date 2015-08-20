var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var q = require('q');

var TagCategory = require(path.join(__dirname, '../model/tag-category'));
var Tag = require(path.join(__dirname, '../model/tag'));
var Indicator = require(path.join(__dirname, '../model/indicator'));

/* GET initialize */
router.get('/', function(req, res) {

	var plainTagCategories;
	var plainTags = [];
	var plainIndicators = [];

	// keys [category.name][tag.name]
	var tagDictionary = [];

	function setPlainTagCategories(categories) {

		plainTagCategories = categories;
		return categories;
	}

	function addPlainTags(tags) {
		plainTags = plainTags.concat(tags);
		return plainTags;
	}

	function addPlainIndicators(indicators) {
		plainIndicators = plainIndicators.concat(indicators);
		return indicators;
	}

	function sendData(data) {
		// console.log("sent", data);
		var result = data;
		res.send(result);
		res.status(200).end();
	}

	function sendError(err) {
		// console.error(err);
		res.send(err);
		res.status(500).end();
	}

	function dataAt(n) {
		return function(data) {
			return data[n];
		};
	}

	function removeAll(data) {
		return q.all([ TagCategory.remove(), Tag.remove(), Indicator.remove() ]);
	}

	function loadData(data) {
		return q.all([
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/tag-category.json'), 'utf-8').then(
						JSON.parse).then(setPlainTagCategories),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-al.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-cc.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-ccs.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-ge.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-gr.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-in.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-it.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-na.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-pe.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-ss.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-up.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-yr.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1434-1435-indicator_1-1.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1433-1434-indicator_1-1.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1432-1433-indicator_1-1.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1431-1432-indicator_1-1.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1430-1431-indicator_1-1.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1429-1430-indicator_1-1.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1428-1429-indicator_1-1.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1427-1428-indicator_1-1.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1426-1427-indicator_1-1.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1425-1426-indicator_1-1.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1434-1435-indicator_1-2.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1433-1434-indicator_1-2.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1432-1433-indicator_1-2.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1431-1432-indicator_1-2.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1430-1431-indicator_1-2.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1429-1430-indicator_1-2.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1428-1429-indicator_1-2.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1427-1428-indicator_1-2.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1426-1427-indicator_1-2.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1425-1426-indicator_1-2.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1434-1435-indicator_1-5.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1433-1434-indicator_1-5.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1432-1433-indicator_1-5.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1431-1432-indicator_1-5.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1430-1431-indicator_1-5.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1429-1430-indicator_1-5.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1428-1429-indicator_1-5.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1427-1428-indicator_1-5.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1426-1427-indicator_1-5.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1425-1426-indicator_1-5.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1434-1435-indicator_1-6.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1433-1434-indicator_1-6.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1434-1435-indicator_1-8.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1433-1434-indicator_1-8.json'),
						'utf-8').then(JSON.parse).then(addPlainIndicators) ]);
	}

	function insertTagCategories(data) {
		q.nbind(TagCategory.collection.insert, TagCategory.collection)(
				plainTagCategories);
	}

	function insertTags(data) {
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
			return q.nbind(Tag.collection.insert, Tag.collection)(tags);
		});
	}

	function updateTags(data) {
		return q.all(_.map(plainTags, function(plainTag) {
			// console.log(plainTag.category);
			// console.log(plainTag.name);
			// console.log(tagDictionary[plainTag.category]);
			tagDictionary[plainTag.category][plainTag.name]._tags = _.map(
					plainTag.tags, function(t) {
						return tagDictionary[t.category][t.tag];
					});
			var result = tagDictionary[plainTag.category][plainTag.name].save();
			return result;
		}));
	}

	function updateTagCategoryTags(data) {
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
		var indicators = _.map(plainIndicators, function(indicator) {
			// console.log("TD", tagDictionary);
			return {
				value : indicator.value,
				_tags : _.map(indicator.tags, function(tag) {
					// console.log("CAT", tag.category);
					// console.log("TAG", tag);
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

	removeAll()//
	.then(loadData)//
	.then(insertTagCategories)//
	.then(insertTags)//
	.then(updateTagCategoryTags)//
	.then(createTagDictionary)//
	.then(updateTags)//
	.then(insertIndicators)//
	.then(function(data) {
		// console.log("DATA", data);
		var result = data;
		sendData(result);
		return result;
	}).done();
});

module.exports = router;
