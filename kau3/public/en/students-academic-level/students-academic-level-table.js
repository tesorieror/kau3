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

	factory.name = 'Full Table';
	
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

//		console.log("data.categories", data.categories);

		var categoryIdOrder = _.pluck(data.categories, '_id');
		return _.map(data.indicators, function(indicator) {
			var tags = _.sortBy(indicator._tags, function(tag) {
				return categoryIdOrder.indexOf(tag._category);
			});
			var values = _.map(tags, function(tag) {
				return {
					"v" : tag.description,
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