/**
 * 
 */
var express = require('express');
var router = express.Router();

var path = require('path');
var _ = require('underscore');
var q = require('q');
var fs = require('q-io/fs');
var c = require('./common');

q.longStackSupport = true;

var TagCategory = require(path.join(__dirname, '../model/tag-category'));
var Tag = require(path.join(__dirname, '../model/tag'));
var Indicator = require(path.join(__dirname, '../model/indicator'));

function State() {

	var state;
	var error;

	function init() {
		done();
	}

	this.isError = function() {
		return state === "ERROR";
	}

	this.isDone = function() {
		return state === "DONE";
	}

	this.isProcessing = function() {
		return state === "PROCESSING";
	}

	this.done = function() {
		state = "DONE";
		error = null;
	}

	this.processing = function() {
		state = "PROCESSING";
		error = null;
	}

	this.error = function(err) {
		state = "ERROR";
		error = err;
	}

	this.state = function() {
		return state;
	}

	init();
	return this;
}

var state = State(); // Request state to ensure singleton

/**
 * Send Data
 * 
 * @param res
 * @param data
 */
function sendData(res, data) {
	res.status(200).send(data).end();
}

/**
 * Send Status
 * 
 * @param res
 */
function sendStatus(res) {
	res.status(200).send({
		state : state.state()
	}).end();
}

router.get('/check', function(req, res) {
	console.log('Check state: ', state.state());
	sendStatus(res);
});

router.get('/start', function(req, res) {

	var DATADIR = '../data/';

	// configResponse();
	// var plainTagCategories;
	// var plainTags = [];
	// var plainIndicators = [];
	// var tagDictionary = [];

	if (!state.isProcessing()) {
		state.processing();
		// setTimeout(state.done, 5000);
		process()//		
		.then(state.done, state.error);
		// removeAll()//
		// .then(loadData)//
		// .then(insertTagCategories)//
		// .then(insertTags)//
		// .then(updateTagCategoryTags)//
		// .then(createTagDictionary)//
		// .then(updateTagDependencies)//
		// .then(insertIndicators)//
		// .done(onFulfilled, onRejection, onProgress);
	}
	sendStatus(res);

	/***************************************************************************
	 * Functions
	 */

	/***************************************************************************
	 * Process
	 */
	function process() {
		return listFiles(DATADIR) //		
		.then(processFiles)//
		.then(c.log('[process] OK', false), c.error('[process] FAILED'))//
		;
	}

	function processFiles(files) {
		return q.all([ processTagCategories(files), processTags(files),
				processIndicators(files) ]);
	}

	/**
	 * List files
	 */
	function listFiles() {
		return fs.list(DATADIR)//
		.then(c.log('[listFiles] OK', false), c.error('[listFiles] FAILED'));
	}

	/***************************************************************************
	 * Process Tag Categories
	 */
	function processTagCategories(files) {
		// return TagCategory.remove() //
		return q.nbind(TagCategory.remove, TagCategory)()//
		.then(c.log('[removeTagCategories] OK', false),
				c.error('[removeTagCategories] FAILED'))//
		.then(function(result) {
			return readFiles(filterTagCategoryFiles(files))//
			.then(toJSON)//
			.then(concatArrays)//					
			.then(assignIds)//
			.then(to1000arrays)//
			.then(insertTagCategories);
		})//
		.then(c.log('[processTagCategories] OK', false),
				c.error('[processTagCategories] FAILED'));
	}

	function filterTagCategoryFiles(files) {
		return _.filter(files, function(f) {
			return f.match(/^category-.+$/g);
		});
	}

	function readFiles(files) {
		return q.all(_.map(files, function(f) {
			return fs.read(DATADIR + f);
		}))//
		.then(c.log('[readFiles] OK', false), c.error('[readFiles] FAILED'));
	}

	function concatArrays(arrayLists) {
		// console.log('concatArrays arrayLists', arrayLists);
		return [].concat.apply([], arrayLists);
	}

	function toJSON(contents) {
		return _.map(contents, function(content) {
			return JSON.parse(content);
		});
	}

	function assignIds(objects) {
		// console.log('assignIds objects', objects);
		_.each(objects, function(object) {
			// console.log('assignIds object.name', object.name);
			var key = object.category + '-' + object.name;
			object._id = key;
		});
		// console.log('assignIds objects', objects);
		return objects;
	}

	function to1000arrays(array) {
		// console.log('to1000arrays array', array);
		var arrays = [];
		while (array.length > 0) {
			arrays.push(array.splice(0, 1000));
		}
		return arrays;
	}

	function insertTagCategories(arrays) {
		// console.log('insertTagCategories arrays', arrays);
		return q.all(
				_.map(arrays, function(array) {
					// return TagCategory.collection.insert(array);
					return q.nbind(TagCategory.collection.insert,
							TagCategory.collection)(array);

				}))//
		.then(c.log('[insertTagCategories] OK', false),
				c.error('[insertTagCategories] FAILED'));
	}

	/***************************************************************************
	 * Process tags
	 */

	function processTags(files) {
		// return TagCategory.remove() //
		return q.nbind(Tag.remove, Tag)()//
		.then(c.log('[removeTags] OK', false),
				c.error('[removeTagCats] FAILED'))//
		.then(function(result) {
			return readFiles(filterTagFiles(files))//
			.then(toJSON)//
			.then(concatArrays)//					
			.then(assignIds)//
			.then(to1000arrays)//
			.then(insertTags);
		})
				//
				.then(c.log('[processTags] OK', false),
						c.error('[processTags] FAILED'));
	}

	function filterTagFiles(files) {
		return _.filter(files, function(f) {
			return f.match(/^tag-.+$/g);
		});
	}

	function insertTags(arrays) {
		// console.log('insertTagCategories arrays', arrays);
		return q.all(_.map(arrays, function(array) {
			// return TagCategory.collection.insert(array);
			return q.nbind(Tag.collection.insert, Tag.collection)(array);
		}))//
		.then(c.log('[insertTags] OK', false), c.error('[insertTags] FAILED'));
	}

	/***************************************************************************
	 * Process indicators
	 */

	function processIndicators(files) {
		// return TagCategory.remove() //
		return q.nbind(Indicator.remove, Indicator)()//
		.then(c.log('[processIndicators] OK', false),
				c.error('[processIndicators] FAILED'))//
		.then(function(result) {
			return readFiles(filterIndicatorFiles(files))//
			.then(toJSON)//
			.then(concatArrays)//					
			.then(assignIdsByTags)//
			.then(to1000arrays)//
			.then(insertIndicators);
		}) //
		.then(c.log('[processIndicators] OK', false),
				c.error('[processIndicators] FAILED'));
	}

	function filterIndicatorFiles(files) {
		return _.filter(files, function(f) {
			return f.match(/^indicator-.+$/g);
		});
	}

	function assignIdsByTags(objects) {
		// console.log('assignIds objects', objects);
		_.each(objects, function(object) {
			// console.log('assignIds object.name', object.name);
			// var key = _.zip(_.pluck(object.tags, 'category'),
			// _.pluck(object.tags, 'name')).join('-');
			var key = _.map(object.tags, function(tag) {
				return tag.category + '-' + tag.name;
			}).join('-');
			object._id = key;
		});
		// console.log('assignIds objects', objects);
		return objects;
	}

	function insertIndicators(arrays) {
		// console.log('insertTagCategories arrays', arrays);
		return q.all(_.map(arrays, function(array) {
			// return TagCategory.collection.insert(array);
			return q.nbind(Indicator.collection.insert, Indicator.collection)(array);
		}))//
		.then(c.log('[insertIndicators] OK', false),
				c.error('[insertIndicators] FAILED'));
	}

	// /**
	// * ClearDB
	// */
	// function clearDB() {
	// return q.all(
	// [ TagCategory.remove(), Tag.remove(),
	// Indicator.remove() ])
	// //
	// .then(c.log('[clearDB] OK', false),
	// c.error('[clearDB] FAILED'));
	// }
	// /**
	// *
	// */
	// function filterTagFiles(files) {
	// return _.filter(files, function(f) {
	// return f.match(/^tag-.+$/g);
	// });
	// }
	// /**
	// *
	// */
	// function filterIndicatorFiles(files) {
	// return _.filter(files, function(f) {
	// return f.match(/^indicator-.+$/g);
	// });
	// }
	//
	// function readFiles(fileLists) {
	// return _.map(fileLists, function(files) {
	// return _.map(files, function(f) {
	// return fs.read(DATA + f);
	// });
	// });
	// }
	//
	// // var readPromises = _.map(catFiles, function(f) {
	// // return fs.read(DATA + f).then(JSON.parse).then(assignId)//
	// // .then(function(categories) {
	// // _.map()
	// // return params;
	// // });
	// // });
	// //
	// // return readPromises;
	//
	// /**
	// * Insert files
	// */
	// function insert(files) {
	// return q.all([ insertTagCategories(files), insertTags(files),
	// insertIndicators(files) ]);
	// }
	// /**
	// *
	// */
	// function insertTagCategories(files) {
	// console.log('Tag Categories ', files);
	// var catFiles = _.filter(files, function(f) {
	// return f.match(/^category-.+$/g);
	// });
	//
	// return catFiles;
	// // var readPromises = _.map(catFiles, function(f) {
	// // return fs.read(DATA + f).then(JSON.parse).then(assignId)//
	// // .then(function(categories) {
	// // _.map()
	// // return params;
	// // });
	// // });
	// //
	// // return readPromises;
	// }
	// /**
	// *
	// */
	// function insertTags(files) {
	// console.log('Tags ', files);
	// return _.filter(files, function(f) {
	// return f.match(/^tag-.+$/g);
	// });
	// }
	// /**
	// *
	// */
	// function insertIndicators(files) {
	// console.log('Indicators ', files);
	// return _.filter(files, function(f) {
	// return f.match(/^indicator-.+$/g);
	// });
	// }
	/***************************************************************************
	 * 
	 */
	// /**
	// * Config response
	// */
	// function configResponse() {
	// res.setTimeout(600000, function() {
	// console.error(req.originalUrl + ' timed out!');
	// res.send(408);
	// });
	// }
	//
	// function setPlainTagCategories(categories) {
	// console.log("Setting plain tag categories");
	// plainTagCategories = categories;
	// return categories;
	// }
	//
	// function addPlainTags(tags) {
	// console.log("Adding plain tags");
	// // console.log(tags);
	// plainTags = plainTags.concat(tags);
	// return plainTags;
	// }
	//
	// function addPlainIndicators(indicators) {
	// console.log("Adding plain indicators");
	// plainIndicators = plainIndicators.concat(indicators);
	// return indicators;
	// }
	//
	// function dataAt(n) {
	// return function(data) {
	// return data[n];
	// };
	// }
	//
	// function myError() {
	// var deferred = q.defer();
	//
	// setTimeout(function() {
	//
	// deferred.reject("My Error");
	// console.error("MY ERROR");
	// // try {
	// // throw new Error("my error");
	// // } catch (err) {
	// // deferred.reject(err);
	// // }
	// }, 2000);
	// console.log("after timeout");
	// return deferred.promise;
	// }
	//
	// function removeAll(params) {
	// console.log("Removing data");
	// return q.all([ TagCategory.remove(), Tag.remove(),
	// Indicator.remove() ]);
	// }
	//
	// function logError(msg) {
	// return function(error) {
	// console.error(msg, error);
	// throw error;
	// };
	// }
	//
	// function log(msg) {
	// return function(res) {
	// console.log(msg);
	// return res;
	// }
	// }
	//
	// function logInfo(msg) {
	// return function(res) {
	// console.info(msg);
	// return res;
	// }
	// }
	//
	// function loadJSONFile(file) {
	// log("Loading " + file)();
	// return q.nfbind(fs.readFile)(path.join(__dirname, file),
	// 'utf-8')//
	// .then(log(file + " loaded!"), logError(file + " not loaded!"))//
	// .then(log("Parsing " + file))//
	// .then(JSON.parse)//
	// .then(log(file + " parsed!"), logError(file + " parser error!"));
	// }
	// function loadData(data) {
	// return q.all([
	// /**
	// * Tag Categories
	// */
	// loadJSONFile('../data/tag-category.json').then(setPlainTagCategories),
	//
	// /**
	// * Tags
	// */
	//
	// // loadJSONFile('../data/tag-al.json').then(addPlainTags), //
	// // loadJSONFile('../data/tag-cc.json').then(addPlainTags), //
	// // loadJSONFile('../data/tag-ccs.json').then(addPlainTags), //
	// loadJSONFile('../data/tag-ge.json').then(addPlainTags), //
	// // loadJSONFile('../data/tag-gr.json').then(addPlainTags), //
	// loadJSONFile('../data/tag-in.json').then(addPlainTags), //
	// loadJSONFile('../data/tag-it.json').then(addPlainTags), //
	// loadJSONFile('../data/tag-na.json').then(addPlainTags), //
	// // loadJSONFile('../data/tag-pe.json').then(addPlainTags), //
	// loadJSONFile('../data/tag-ss.json').then(addPlainTags), //
	// // loadJSONFile('../data/tag-up.json').then(addPlainTags), //
	// loadJSONFile('../data/tag-yr.json').then(addPlainTags), //
	// // loadJSONFile('../data/tag-ds.json').then(addPlainTags), //
	// loadJSONFile('../data/tag-ssys.json').then(addPlainTags), //
	// loadJSONFile('../data/tag-co.json').then(addPlainTags), //
	// loadJSONFile('../data/tag-se.json').then(addPlainTags), //
	// loadJSONFile('../data/tag-sp.json').then(addPlainTags), //
	//
	// /**
	// * Indicators
	// */
	//
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1434-1435-indicator_1-1.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1433-1434-indicator_1-1.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1432-1433-indicator_1-1.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1431-1432-indicator_1-1.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1430-1431-indicator_1-1.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1429-1430-indicator_1-1.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1428-1429-indicator_1-1.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1427-1428-indicator_1-1.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1426-1427-indicator_1-1.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1425-1426-indicator_1-1.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1434-1435-indicator_1-2.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1433-1434-indicator_1-2.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1432-1433-indicator_1-2.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1431-1432-indicator_1-2.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1430-1431-indicator_1-2.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1429-1430-indicator_1-2.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1428-1429-indicator_1-2.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1427-1428-indicator_1-2.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1426-1427-indicator_1-2.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1425-1426-indicator_1-2.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1434-1435-indicator_1-5.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1433-1434-indicator_1-5.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1432-1433-indicator_1-5.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1431-1432-indicator_1-5.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1430-1431-indicator_1-5.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1429-1430-indicator_1-5.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1428-1429-indicator_1-5.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1427-1428-indicator_1-5.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1426-1427-indicator_1-5.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1425-1426-indicator_1-5.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1434-1435-indicator_1-6.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1433-1434-indicator_1-6.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1432-1433-indicator_1-6.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1431-1432-indicator_1-6.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1430-1431-indicator_1-6.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1429-1430-indicator_1-6.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1428-1429-indicator_1-6.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1427-1428-indicator_1-6.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1426-1427-indicator_1-6.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1425-1426-indicator_1-6.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1434-1435-indicator_1-8.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1433-1434-indicator_1-8.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1432-1433-indicator_1-8.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1431-1432-indicator_1-8.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1430-1431-indicator_1-8.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1429-1430-indicator_1-8.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1428-1429-indicator_1-8.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1427-1428-indicator_1-8.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1426-1427-indicator_1-8.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1425-1426-indicator_1-8.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1434-1435-indicator_2-4.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1434-1435-indicator_2-7.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1434-1435-indicator_2-13.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// // q.nfbind(fs.readFile)(path.join(__dirname,
	// // '../data/1434-1435-indicator_2-14.json'), 'utf-8').then(
	// // JSON.parse).then(addPlainIndicators),
	// loadJSONFile('../data/1434-1435-indicator_2-15.json').then(addPlainIndicators)
	// //
	// ]).then(function(res) {
	// console.info("Data loaded!");
	// return data;
	// }, function(error) {
	// console.error("Data load error", error);
	// throw error;
	// });
	//
	// }
	// function insertTagCategories(data) {
	// console.log("Inserting tag categories");
	// return q.nbind(TagCategory.collection.insert,
	// TagCategory.collection)(plainTagCategories);
	// }
	// function insertTags(data) {
	// // console.log("Inserting tags", plainTags);
	// var tags = _.map(plainTags, function(tag) {
	// return q.nbind(TagCategory.findOne, TagCategory)({
	// name : tag.category
	// }).then(function(category) {
	// console.log('cat: ', category.name, ' tag: ', tag.name);
	//
	// return {
	// name : tag.name,
	// description : tag.description,
	// order : tag.order,
	// // _tags : [],
	// _category : category._id
	// };
	// });
	// }, function(err) {
	// console.error(err);
	// throw err;
	// });
	//
	// return q.all(tags).then(function(tags) {
	// var arrays = [];
	// while (tags.length > 0) {
	// arrays.push(tags.splice(0, 1000));
	// }
	// return q.all(_.map(arrays, function(a) {
	// return q.nbind(Tag.collection.insert, Tag.collection)(a);
	// }));
	// });
	// }
	// function updateTagDependencies(data) {
	// console.log("Updating tags");
	// return q.all(_.map(plainTags, function(plainTag) {
	// // console.log("PlainTag", plainTag);
	// tagDictionary[plainTag.category][plainTag.name]._dependencies =
	// [];
	// return q.all(_.map(plainTag.tags, function(dependency) {
	// // console.log("Dep", dependency);
	// return new TagDependency({
	// _tags : _.map(dependency, function(tag) {
	// // console.log("DepTag", tag);
	// return tagDictionary[tag.category][tag.tag];
	// })
	// }).save().then(function(dep) {
	// // console.log('DEP', dep);
	//
	// tagDictionary[plainTag.category][plainTag.name]._dependencies.push(dep);
	// return dep;
	// });
	// })).then(function(deps) {
	// return
	// tagDictionary[plainTag.category][plainTag.name].save().then(function(tag)
	// {
	// return tag;
	// }, function(err) {
	// console.error(plainTag.category, plainTag.name);
	// console.error(err);
	// });
	// });//
	// }));
	// }
	//
	// function updateTagCategoryTags(data) {
	// console.log("Updating tag categories");
	// return q.all(TagCategory.find()//
	// .then(function(categoryTags) {
	// return _.map(categoryTags, function(categoryTag) {
	// return q.nbind(Tag.find, Tag)({
	// _category : categoryTag._id
	// })//
	// .then(function(tags) {
	// categoryTag._tags = tags;
	// return categoryTag.save();
	// });
	// });
	// }));
	// }
	//
	// function createTagDictionary() {
	// console.log("Creating tag dictionary");
	// return q.nbind(TagCategory.find, TagCategory)()//
	// .then(function(tagCategories) {
	// return q.nbind(Tag.populate, Tag)(tagCategories, {
	// path : '_tags'
	// });
	// })//
	// .then(function(tagCategories) {
	// _.each(tagCategories, function(tc) {
	// tagDictionary[tc.name] = _.indexBy(tc._tags, 'name');
	// });
	// return tagDictionary;
	// });
	// }
	//
	// function insertIndicators() {
	// console.log("Inserting indicators");
	// var indicators = _.map(plainIndicators, function(indicator) {
	// return {
	// value : indicator.value,
	// _tags : _.map(indicator.tags, function(tag) {
	// return tagDictionary[tag.category][tag.name]._id;
	// }),
	// amount : indicator.tags.length
	// };
	// });
	//
	// var arrays = [];
	// while (indicators.length > 0) {
	// arrays.push(indicators.splice(0, 1000));
	// }
	// return (q.all(_.map(arrays, function(a) {
	// return q.nbind(Indicator.collection.insert,
	// Indicator.collection)(a);
	// })));
	// }
	//
	// function onFulfilled(data) {
	// console.info("DONE");
	// state = "DONE";
	// sendData({
	// state : state
	// });
	// return data;
	// }
	//
	// function onRejection(param) {
	// state = "ERROR"
	// // console.error("Rejection", param);
	// // console.error("Unhandled reasons", q.getUnhandledReasons());
	// sendError({
	// state : state
	// });
	// return param;
	// }
	//
	// function onProgress(param) {
	// console.log(param);
	// return param;
	// }
});

module.exports = router;
