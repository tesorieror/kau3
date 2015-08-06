/**
 * ChartBuilderModule
 */

var ChartBuilderModule = angular.module('ChartBuilderModule', []);

ChartBuilderModule.factory('FullTableBuilder', function($http, $q, $log) {

	var factory = {};

	/**
	 * Public functions
	 */

	factory.build = function(data) {
		return buildFullTableChart(data);
	};

	factory.name = 'Full Table';

	// Hack to Force refresh
	var hack = '';

	/**
	 * Private functions
	 */

	function buildFullTableChart(data) {
		var chart = buildTableChart();
		chart.data.cols = buildFullTableCols(data);
		chart.data.rows = buildFullTableRows(data);
		return chart;
	}

	function buildTableChart() {
		var chart = buildChart();
		chart.type = 'Table';
		chart.options.pageSize = 20;
		chart.options.page = "enable";
		chart.options.showRowNumber = false;
		chart.options.sort = "enable";
		return chart;
	}

	function buildChart() {
		return {
			"displayed" : true,
			"data" : {},
			"options" : {
				"width" : '100%',
				"height" : '100%',
				"allowHtml" : "true",
			}
		};
	}

	function buildFullTableCols(data) {
		var categories = data.metadata.categories;
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
		// Force refresh
		hack = hack.length == 0 ? ' ' : '';
		result.push({
			"id" : "value",
			"label" : "Students" + hack,
			"type" : "number",
			"p" : {
				"style" : "font-size:11px"
			},
		});
		return result;
	}

	function buildFullTableRows(data) {
		return _.map(data.indicators, function(indicator) {
			// CategoryId order
			var categoryIdOrder = _.pluck(data.metadata.categories, '_id');
			// Filter tags by categoryId
			var tags = _.filter(indicator._tags, function(tag) {
				return data.metadata.categories[tag._category] != null;
			});
			// Sort tags by categoryId
			tags = _.sortBy(tags, function(tag) {
				return categoryIdOrder.indexOf(tag._category);
			});
			// Build Rows
			var values = _.map(tags, function(tag) {
				return {
					"v" : tag.description,
					"p" : {
						"style" : "font-size:11px"
					}
				};
			});
			values.push({
				"v" : indicator.value,
				"p" : {
					"style" : "font-size:11px"
				}
			});
			return {
				"c" : values
			};
		});
	}

	return factory;
});