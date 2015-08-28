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

	function removeAll(data) {
		console.log("Removing data");
		return q.all([ TagCategory.remove(), Tag.remove(), Indicator.remove() ]);

	}

	function loadData(data) {
		console.log("Loading data");
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
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-ds.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-sy.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-co.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-se.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),
				q.nfbind(fs.readFile)(path.join(__dirname, '../data/tag-sp.json'),
						'utf-8').then(JSON.parse).then(addPlainTags),

		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1434-1435-indicator_1-1.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1433-1434-indicator_1-1.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1432-1433-indicator_1-1.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1431-1432-indicator_1-1.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1430-1431-indicator_1-1.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1429-1430-indicator_1-1.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1428-1429-indicator_1-1.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1427-1428-indicator_1-1.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1426-1427-indicator_1-1.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1425-1426-indicator_1-1.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1434-1435-indicator_1-2.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1433-1434-indicator_1-2.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1432-1433-indicator_1-2.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1431-1432-indicator_1-2.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1430-1431-indicator_1-2.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1429-1430-indicator_1-2.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1428-1429-indicator_1-2.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1427-1428-indicator_1-2.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1426-1427-indicator_1-2.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1425-1426-indicator_1-2.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1434-1435-indicator_1-5.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1433-1434-indicator_1-5.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1432-1433-indicator_1-5.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1431-1432-indicator_1-5.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1430-1431-indicator_1-5.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1429-1430-indicator_1-5.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1428-1429-indicator_1-5.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1427-1428-indicator_1-5.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1426-1427-indicator_1-5.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1425-1426-indicator_1-5.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1434-1435-indicator_1-6.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1433-1434-indicator_1-6.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1432-1433-indicator_1-6.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1431-1432-indicator_1-6.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1430-1431-indicator_1-6.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1429-1430-indicator_1-6.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1428-1429-indicator_1-6.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1427-1428-indicator_1-6.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1426-1427-indicator_1-6.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1425-1426-indicator_1-6.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1434-1435-indicator_1-8.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1433-1434-indicator_1-8.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1432-1433-indicator_1-8.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1431-1432-indicator_1-8.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1430-1431-indicator_1-8.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1429-1430-indicator_1-8.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1428-1429-indicator_1-8.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1427-1428-indicator_1-8.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1426-1427-indicator_1-8.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1425-1426-indicator_1-8.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1434-1435-indicator_2-4.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators),
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1434-1435-indicator_2-7.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators) ]);
		// q.nfbind(fs.readFile)(
		// path.join(__dirname, '../data/1434-1435-indicator_2-13.json'),
		// 'utf-8').then(JSON.parse).then(addPlainIndicators)
		]);

	}

	function insertTagCategories(data) {
		console.log("Inserting tag categories");
		return q.nbind(TagCategory.collection.insert, TagCategory.collection)(
				plainTagCategories);
	}

	function insertTags(data) {
		console.log("Inserting tags");
		var tags = _.map(plainTags, function(tag) {
			// console.log("TAG");
			// console.log(tag.category);
			//
			// q.nbind(TagCategory.findOne, TagCategory)({
			// name : tag.category
			// }).then(function(category) {
			// console.log("CAT", category._id);
			// });

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
			// return q.nbind(Tag.collection.insert, Tag.collection)(tags);
		});
	}

	function updateTags(data) {
		console.log("Updating tags");
		return q.all(_.map(plainTags, function(plainTag) {
			// console.log("Tag & Category", plainTag.category, plainTag.name);
			// console.log(tagDictionary[plainTag.category]);
			tagDictionary[plainTag.category][plainTag.name]._tags = _.map(
					plainTag.tags, function(t) {
						return tagDictionary[t.category][t.tag];
					});
			console.log("Start Save", plainTag.category, plainTag.name);
			var result = tagDictionary[plainTag.category][plainTag.name]
					.save(function(info) {
						console.log("End Save", plainTag.category, plainTag.name, info);
					});
			return result;
		}));
	}

	function updateTagCategoryTags(data) {
		console.log("Updating tag categories");
		return q.all(TagCategory.find()//
		.then(function(categoryTags) {
			// console.log(categoryTags);
			return _.map(categoryTags, function(categoryTag) {

				// console.log("TAG CATEGORY [" + categoryTag + "]");
				//
				// q.nbind(Tag.find, Tag)({
				// _category : categoryTag._id
				// }).then(function(tag){
				// console.log("TAG", tag);
				// });//

				return q.nbind(Tag.find, Tag)({
					_category : categoryTag._id
				})//
				.then(function(tags) {
					// console.log("Tags", tags.length);
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
			// console.log("TD", tagDictionary);
			return {
				value : indicator.value,
				_tags : _.map(indicator.tags, function(tag) {
					// console.log("CAT", tag.category);
					// console.log("TAG", tag);
					// if(tag.name=='DCSCE-UAQU'){
					// console.log("CAT", tag.category);
					// console.log("TAG", tag);
					// console.log(_.keys(tagDictionary));
					// console.log(tagDictionary[tag.category]);
					// }
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
		console.info("Filfilled ", data);
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
		console.log("Progress ", param);
		return param;
	}

	removeAll()//
	.then(loadData)//
	.then(insertTagCategories)//
	.then(insertTags)//
	.then(updateTagCategoryTags)//
	.then(createTagDictionary)//
	.then(updateTags)//
	.then(insertIndicators)//
	.done(onFulfilled, onRejection, onProgress);
});

module.exports = router;
