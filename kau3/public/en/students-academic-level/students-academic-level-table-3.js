/**
 * New node file
 */
app.factory('indicatorTable3', function($http, $q, $log) {

	var factory = {};

	/**
	 * Public functions
	 */

	factory.build = function(data) {
		return buildChart(data);
	};

	factory.name = 'Description Table';
	
	/**
	 * Private functions
	 */

	function buildChart(data) {
		var chart = {
			"type" : 'Table',
			"displayed" : true,
			"data" : {
				"cols" : buildCols(data),
				"rows" : buildRows(data)
			},
			"options" : {
				// "width" : "100%",
				// "height" : "450",
				"width" : '100%',
				"height" : '100%',
				"pageSize" : "20",
				"page" : "enable",
				"showRowNumber" : false,
				"sort" : "enable",
				"allowHtml" : "true",
			}
		// ,
		// "formatters" : {
		// "number" : [ {
		// "columnNum" : 2,
		// "suffix" : "%",
		// "fractionDigits" : 2
		// } ]
		// }
		};
		return chart;
	}

	function buildCols(data) {

		var categories = data.categories.slice(1);
		var result = [];

		var result = [{
			"id" : 'descriptionId',
			"label" : 'Description',
			"type" : "string",
			"p" : {
				"style" : "font-size:11px"
			},
		}];

		var yearCat = data.categories[0];
		var yearTags = _.filter(yearCat._tags, function(tag) {
			return data.tagFilterModel[yearCat._id][tag._id];
		});

		result = result.concat(_.map(yearTags, function(yearTag) {
			return {
				"id" : yearTag.name,
				"label" : yearTag.name,
				"type" : "number",
				"p" : {
					"style" : "font-size:11px"
				}
			}
		}));

		// console.log('Result', result);

		return result;
	}

	function buildRows(data) {
		var categoryIdOrder = _.pluck(data.categories, '_id');

		var cols = _.pluck(data.categories.slice(1), 'name');
		var yearCat = data.categories[0];
		var yearTags = _.filter(yearCat._tags, function(tag) {
			return data.tagFilterModel[yearCat._id][tag._id];
		});
		cols = cols.concat(_.pluck(yearTags, 'name'));
		console.log(cols);

		var yearValues = {};

		_.map(data.indicators, function(indicator) {
			var tags = _.sortBy(indicator._tags, function(tag) {
				return categoryIdOrder.indexOf(tag._category);
			});
			var yr = tags[0];
			tags = tags.slice(1);
			var key = _.pluck(tags, '_id').join();
			if (!yearValues[key]) {
				yearValues[key] = {
					tags : tags
				};
			}
			yearValues[key][yr.name] = indicator.value;
		});

		return _.map(_.keys(yearValues), function(key) {
//			console.log(key);
//			console.log(yearValues[key]);

			var values = [ {
				"v" : yearValues[key].tags[4].description + ' ' + yearValues[key].tags[3].description + ' '
						+ yearValues[key].tags[2].description + ' ' + yearValues[key].tags[1].description + ' at '
						+ yearValues[key].tags[0].description,
				"p" : {
					"style" : "font-size:11px"
				}
			} ].concat(_.map(yearTags, function(yrTag) {
				return {
					"v" : yearValues[key][yrTag.name],
					"p" : {
						"style" : "font-size:11px"
					}
				}
			}));
			return {
				"c" : values
			};
		});
	}
	return factory;
});