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
	var plainTags;
	var plainIndicators;

	function setPlainTagCategories(categories) {
		plainTagCategories = categories;
		return categories;
	}

	function setPlainTags(tags) {
		plainTags = tags;
		return tags;
	}

	function setPlainIndicators(indicators) {
		plainIndicators = indicators;
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
				q.nfbind(fs.readFile)
						(path.join(__dirname, '../data/tag.json'), 'utf-8')
						.then(JSON.parse).then(setPlainTags),
				q.nfbind(fs.readFile)(
						path.join(__dirname, '../data/1434-1435-indicator.json'), 'utf-8')
						.then(JSON.parse).then(setPlainIndicators) ]);
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
				tag._category = category._id;
				delete tag.category;
				return tag;
			});
		});
		return q.all(tags).then(function(tags) {
			return q.nbind(Tag.collection.insert, Tag.collection)(tags);
		});
	}

	function updateTagCategoryTags(data) {
		return q.all(TagCategory.find().then(function(categoryTags) {
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

	function insertIndicators() {
		return q.nbind(TagCategory.find, TagCategory)()//
		.then(function(tagCategories) {
			return q.nbind(Tag.populate, Tag)(tagCategories, {
				path : '_tags'
			});
		})//
		.then(function(tagCategories) {
			var tagDictionary = [];
			_.each(tagCategories, function(tc) {
				tagDictionary[tc.name] = _.indexBy(tc._tags, 'name');
			});
			return tagDictionary;
		})//
		.then(function(mydic) {
			return _.map(plainIndicators, function(indicator) {
				indicator._tags = _.map(indicator.tags, function(tag) {
					return mydic[tag.category][tag.name]._id;
				});
				delete indicator.tags;
				return indicator;
			});
		})//
		.then(
				function(indicators) {
					return q.nbind(Indicator.collection.insert, Indicator.collection)(
							indicators);
				});
	}

	removeAll()//
	.then(loadData)//
	.then(insertTagCategories)//
	.then(insertTags)//
	.then(updateTagCategoryTags)//
	.then(insertIndicators)//
	.then(function(data) {
		// console.log("DATA", data);
		var result = data;
		sendData(result);
		return result;
	}).done();
});

module.exports = router;
