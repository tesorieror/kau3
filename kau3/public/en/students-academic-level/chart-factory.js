/**
 * Students Academic Level Chart Factory
 */

app.factory('ChartFactory', function($http, $q, $log, ModelFactory) {

	var factory = {};
	var hack = '';

	function buildFullTable(data) {
		var chart = createTableChart();
		chart.data.cols = buildFullTableCols(data);
		chart.data.rows = buildFullTableRows(data)
		return chart;
	}

	function buildFullTableCols(data) {
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

	function createTableChart() {
		var chart = createChart();
		chart.type = 'Table';
		chart.options.pageSize = "20";
		chart.options.page = "enable";
		chart.options.showRowNumber = false;
		chart.options.sort = "enable";
		chart.options.allowHtml = true;
		return chart;
	}

	function createChart() {
		return {
			"displayed" : true,
			"data" : {},
			"options" : {
				"width" : '100%',
				"height" : '100%',
			}
		};
	}

	factory.buildFullTable = buildFullTable;

	return factory;
});