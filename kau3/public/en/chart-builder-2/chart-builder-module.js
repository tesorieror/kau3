/**
 * ChartBuilderModule
 */

var ChartBuilderModule = angular.module('ChartBuilderModule', []);

ChartBuilderModule.factory('ChartBuilderFactory', function($http, $q, $log) {

	var factory = {};

	/**
	 * Public functions
	 */

	factory.buildFullTableChart = buildFullTableChart;
	factory.buildSummaryTableChart = buildSummaryTableChart;
	factory.buildDescriptionTableChart = buildDescriptionTableChart;
	factory.buildColumnChart = buildColumnChart;
	factory.buildLineChart = buildLineChart;
	factory.buildAreaChart = buildAreaChart;
	factory.buildPieChart = buildPieChart;

	// Hack to Force refresh
	var hack = '';

	/**
	 * Private functions
	 */

	/**
	 * Pie Chart
	 */

	function buildPieChart(data, view) {

		// Columns
		var columns = [ 'Descriptor', 'Students' ];

		// Rows
		var rows = _.map(data.indicators, function(indicator) {
			var tags = indicator._tags;
			if (data.indicators.length > 1) {
				tags = _.filter(tags, function(tag) {
					return _.values(data.metadata.tags[tag._category]).length > 1;
				});
			}
			var descriptor = _.pluck(tags, 'description').join(' ');
			return [ descriptor, indicator.value ];
		});

		// Set Data
		var data = google.visualization.arrayToDataTable([ columns ].concat(rows));
		// Set Options
		var options = {
		// title : "Title"
		};
		// Draw Chart
		new google.visualization.PieChart(view).draw(data, options);
	}

	/**
	 * Area Chart
	 */

	function buildAreaChart(data, view) {
		buildChart(data, new google.visualization.AreaChart(view));
	}

	/**
	 * Line Chart
	 */

	function buildLineChart(data, view) {
		buildChart(data, new google.visualization.LineChart(view));
	}

	/**
	 * Columns Chart
	 */

	function buildColumnChart(data, view) {
		buildChart(data, new google.visualization.ColumnChart(view));
	}

	/*****************************************************************************
	 * Build generic chart
	 */
	function buildChart(data, chart) {

		// Common Data
		var categories = _.values(data.metadata.categories);

		var dataCategories = categories.slice(1);

		var tagCollections = _.map(dataCategories, function(cat) {
			return _.values(data.metadata.tags[cat._id]);
		});

		// Generates the combination of tags for each value
		var tagResult = calculateTagColletionsByLevelCombination(tagCollections);

		// Columns
		var columns = [ 'Year' ];

		// Generates columns' title
		var titles = _.map(tagResult, function(tagCollection) {
			var filteredTagCollection = tagCollection;

			// Avoid single tag selection in category (left for title)
			if (tagResult.length > 1) {
				filteredTagCollection = _.filter(filteredTagCollection, function(tag) {
					return _.values(data.metadata.tags[tag._category]).length > 1;
				});
			}

			return _.pluck(filteredTagCollection, 'description').join(' ');
		});

		// Calculate cols
		columns = columns.concat(titles);

		// Rows
		var rows = [];

		/**
		 * Check this!
		 */

		// Patch for invalid configuration
		// if (data.indicators.length < 1) {
		// rows = [];
		// }
		var keys = _.map(tagResult, function(tagCollection) {
			return _.pluck(tagCollection, '_id').join();
		});

		var valuesByYear = getValuesByYear(data);

		var yearTags = _.values(data.metadata.tags[categories[0]._id]);

		rows = _.map(yearTags, function(yrTag) {
			return [ yrTag.name ].concat(_.map(keys, function(key) {
				return (valuesByYear[yrTag._id] != null) ? // 
				(valuesByYear[yrTag._id][key] != null ? // 
				valuesByYear[yrTag._id][key].value : -10000000) : -10000000
			}));
		});

		var chartDataArray = clearInvalidData(rows, columns);
		// [ columns ].concat(rows)

		var chartData = google.visualization.arrayToDataTable(chartDataArray);

		$log.log("Before draw", new Date().getTime());

		// Title
		var title = "TITLE";

		// Filter tags that are not TOTAL
		var filteredTagCollection = _.reduce(dataCategories, function(result, cat) {
			result = result.concat(_.values(data.metadata.tags[cat._id]));
			return result;
		}, []);

		// Filter Tags that are alone in the category
		filteredTagCollection = _.filter(filteredTagCollection, function(tag) {
			return _.values(data.metadata.tags[tag._category]).length == 1;
		});

		title = _.pluck(filteredTagCollection, 'description').join(' ');

		var options = {
			title : title,
			legend : {
				position : 'bottom',
				maxLines : 3
			},
			allowHtml : true,
			height : 500,
			width : 700
		};

		chart.draw(chartData, options);
	}

	function clearInvalidData(rows, cols) {

		// $log.log('Rows', rows);
		// $log.log('Cols', cols);

		var indexes = [];

		for (var c = 1; c < cols.length; c++) {
			var invalid = true;
			for (var r = 0; r < rows.length; r++) {
				invalid = invalid && rows[r][c] == -10000000;
			}
			if (invalid) {
				indexes.push(c);
			}
		}

		$log.log("Indexes length", indexes.length);

		// Filter Columns

		cols = _.filter(cols, function(c) {
			return !_.contains(indexes, cols.indexOf(c));
		});

		// Filter Rows
		// rows = _.map(rows, function(r) {
		// $log.log("Before filter", r.length);
		// var result = _.filter(r, function(c) {
		// return !_.contains(indexes, r.indexOf(c));
		// });
		// $log.log("After filter", result.length);
		// return result;
		// });

		rows = _.map(rows, function(r) {
			var i = 0;
			var result = [];
			_.each(r, function(c) {
				if (!_.contains(indexes, i)) {
					result.push(c);
				}
				i++;
			});
			return result;
		});

		$log.log("Filtered Rows", rows);

		rows = _.map(rows, function(r) {
			return _.map(r, function(c) {
				return c == -10000000 ? 0 : c;
			});
		});

		return [ cols ].concat(rows);
	}

	function calculateTagColletionsByLevelCombination(tagCollections) {
		return _.reduce(tagCollections, function(acc, tagCollection) {
			return _.flatten(_.map(tagCollection, function(tag) {
				return _.map(acc, function(accCollection) {
					return accCollection.slice(0).concat(tag);
				});
			}), true);
		}, [ [] ]);
	}

	function buildChartTitle(data) {
		var categories = _.values(data.metadata.categories);
		// Data categories
		var dataCategories = categories.slice(1);

		var filteredTagCollection;

		// Filter tags that are not TOTAL
		filteredTagCollection = _.reduce(dataCategories, function(result, cat) {
			result = result.concat(_.values(data.metadata.tags[cat._id]));
			return result;
		}, []);

		// Filter Tags that are alone in the category
		filteredTagCollection = _.filter(filteredTagCollection, function(tag) {
			return _.values(data.metadata.tags[tag._category]).length == 1;
		});

		return _.pluck(filteredTagCollection, 'description').join(' ');

	}

	/**
	 * Description Table Chart
	 */

	function buildDescriptionTableChart(data, view) {
		$log.info("Building Description Table");

		var categories = _.values(data.metadata.categories);
		var dataTable = new google.visualization.DataTable();

		// Data categories
		var dataCategories = categories.slice(1);

		// Columns
		dataTable.addColumn('string', 'Description');

		// Year Tags
		var yearCategory = categories[0];
		var yearTags = _.values(data.metadata.tags[yearCategory._id]);

		_.each(yearTags, function(yearTag) {
			dataTable.addColumn('number', yearTag.name);
		});

		// Rows
		var yearValues = getValuesByKey(data);
		var yearKeys = _.keys(yearValues);

		dataTable.addRows(yearKeys.length);

		var yearValues = getValuesByKey(data);
		var i = 0;
		_.each(_.keys(yearValues), function(key) {
			var j = 0;
			dataTable.setCell(i, j++, _.pluck(yearValues[key].tags.slice(1).reverse(), 'description').join(' ')
					.concat(' at ').concat(yearValues[key].tags[0].description));
			dataTable.setProperty(i, j - 1, "style", "white-space:nowrap;");
			_.each(yearTags, function(yrTag) {
				dataTable.setCell(i, j++, yearValues[key][yrTag.name]);
				dataTable.setProperty(i, j - 1, "style", "white-space:nowrap;");
			});
			i++;
		});

		$log.log("Before draw", new Date().getTime());
		var table = new google.visualization.Table(view);

		table.draw(dataTable, {
			showRowNumber : false,
			width : '100%',
			height : '100%',
			page : 'enable',
			pageSize : '20',
			allowHtml : true
		});

		return table;
	}

	/**
	 * Summary Table Chart
	 */

	function buildSummaryTableChart(data, view) {
		var categories = data.metadata.categories;
		var dataTable = new google.visualization.DataTable();

		// Columns

		var categories = _.values(data.metadata.categories);
		// Data categories
		var dataCategories = categories.slice(1);

		_.each(dataCategories, function(category) {
			dataTable.addColumn('string', category.name);
		});

		// Year Tags
		var yearCategory = categories[0];
		var yearTags = _.values(data.metadata.tags[yearCategory._id]);

		_.each(yearTags, function(yearTag) {
			dataTable.addColumn('number', yearTag.name);
		});

		// Rows
		var yearValues = getValuesByKey(data);
		var yearKeys = _.keys(yearValues);

		dataTable.addRows(yearKeys.length);

		var i = 0;
		_.each(yearKeys, function(key) {
			// Creates a row for each key
			var j = 0;
			_.each(yearValues[key].tags, function(tag) {
				dataTable.setCell(i, j++, tag.name);
				dataTable.setProperty(i, j - 1, "style", "white-space:nowrap;");
			});
			_.each(yearTags, function(yrTag) {
				dataTable.setCell(i, j++, yearValues[key][yrTag.name]);
				dataTable.setProperty(i, j - 1, "style", "white-space:nowrap;");
			});
			i++;
		});

		$log.log("Before draw", new Date().getTime());
		var table = new google.visualization.Table(view);

		table.draw(dataTable, {
			showRowNumber : false,
			width : '100%',
			height : '100%',
			page : 'enable',
			pageSize : '20',
			allowHtml : true
		});

		return table;

	}

	/**
	 * Full Table Chart
	 */

	function buildFullTableChart(data, view) {
		var categories = data.metadata.categories;
		var dataTable = new google.visualization.DataTable();

		// Columns
		_.each(categories, function(cat) {
			dataTable.addColumn('string', cat.description);
		});
		dataTable.addColumn('number', 'Students');
		// Rows
		var indicators = data.indicators;
		// CategoryId order
		var categoryIdOrder = _.pluck(data.metadata.categories, '_id');

		dataTable.addRows(indicators.length);
		var i = 0;
		_.each(indicators, function(indicator) {
			// Filter unused tags
			// var tags = _.filter(indicator._tags, function(tag) {
			// return data.metadata.categories[tag._category] != null;
			// });
			// // Sort tags by categoryId
			// tags = _.sortBy(tags, function(tag) {
			// return categoryIdOrder.indexOf(tag._category);
			// });
			_.each(indicator._tags, function(tag) {
				var j = categoryIdOrder.indexOf(tag._category);
				dataTable.setCell(i, j, tag.description);
				dataTable.setProperty(i, j, "style", "white-space:nowrap;");
			});
			dataTable.setCell(i, indicator._tags.length, indicator.value);
			dataTable.setProperty(i, indicator._tags.length, "style", "white-space:nowrap;");
			i++;
		});

		$log.log("Before draw", new Date().getTime());
		var table = new google.visualization.Table(view);

		table.draw(dataTable, {
			showRowNumber : false,
			width : '100%',
			height : '100%',
			page : 'enable',
			pageSize : '20',
			allowHtml : true
		});

		return table;
	}

	/**
	 * Auxiliary functions
	 */

	function getValuesByKey(data) {
		// Calculate values by tagId and year
		var yearValues = [];
		_.each(data.indicators, function(indicator) {
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
			// Year Tag
			var yrTag = tags[0];
			var dataTags = tags.slice(1);
			// Creates the key
			var key = _.pluck(dataTags, '_id').join();
			// Creates the value for tags by year
			if (!yearValues[key]) {
				yearValues[key] = [];
				// Tags for key
				yearValues[key]['tags'] = dataTags;
			}
			yearValues[key][yrTag.name] = indicator.value;
		});
		return yearValues;
	}

	function getValuesByYear(data) {
		// Calculate values by tagId and year
		var yearValues = [];
		_.each(data.indicators, function(indicator) {
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
			// Year Tag
			var yrTag = tags[0];
			var dataTags = tags.slice(1);
			// Creates the key
			var key = _.pluck(dataTags, '_id').join();
			// Creates the value for tags by year
			if (!yearValues[yrTag._id]) {
				yearValues[yrTag._id] = [];
				// Tags for key
				yearValues[yrTag._id]['tag'] = yrTag;
			}
			yearValues[yrTag._id][key] = {
				value : indicator.value,
				tags : dataTags
			};
		});
		return yearValues;
	}

	return factory;
});