/**
 * New node file
 */
app.factory('indicatorTable', function($http, $q, $log) {

	var factory = {};

	/**
	 * Public functions
	 */

	factory.build = function(data) {
		return buildChart(data);
	};

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
				"pageSize" : "10",
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

		var categories = data.categories;
		var result = [];

		var result = _.map(_.values(categories), function(category) {
			return {
				"id" : category.name,
				"label" : category.description,
				"type" : "string",
				"p" : {
					"style" : "font-size:11px"
				},
			};
		});

		result.push({
			"id" : "value",
			"label" : "Students",
			"type" : "number",
			"p" : {
				"style" : "font-size:11px"
			},
		});

		return result;
	}

	function buildRows(data) {

		var tagsById = _.indexBy(data.tags, '_id');
		// var categoriesById = _.indexBy(data.categories, '_id');

		var categoryIdOrder = _.pluck(data.categories, '_id');

		// console.log("tagsById", tagsById);
		// console.log("categoryIdOrder", categoryIdOrder);
		console.log("data.indicators", data.indicators);

		return _.map(data.indicators, function(indicator) {

			var tags = _.sortBy(indicator._tags, function(tag) {
				return categoryIdOrder.indexOf(tagsById[tag]._category);
			});

			// console.log("tags", tags);

			var values = _.map(indicator._tags, function(tagId) {
				return {
					"v" : tagsById[tagId].description,
					"p" : {
						"style" : "font-size:11px"
					}
				}
			});

			values.push({
				"v" : indicator.value,
				"p" : {
					"style" : "font-size:11px"
				}
			});

			return {
				"c" : values
			}
		});
	}

	return factory;
});