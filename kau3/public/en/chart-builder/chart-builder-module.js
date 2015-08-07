/**
 * ChartBuilderModule
 */

var ChartBuilderModule = angular.module('ChartBuilderModule', []);

ChartBuilderModule.factory('ChartBuilderFactory', function($http, $q, $log) {

	var factory = {};

	/**
	 * Public functions
	 */

	// factory.build = function(data) {
	// return buildFullTableChart(data);
	// };
	// factory.build = function(data) {
	// return buildSummaryTableChart(data);
	// };
	// factory.build = function(data) {
	// return buildDescriptionTableChart(data);
	// };
	// factory.build = function(data) {
	// return buildColumnChart(data);
	// };
	// factory.build = function(data) {
	// return buildLineChart(data);
	// };
	// factory.build = function(data) {
	// return buildAreaChart(data);
	// };
	// factory.build = function(data) {
	// return buildPieChart(data);
	// };
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

	function buildPieChart(data) {
		var chart = buildLegendChart();
		chart.type = 'PieChart';
		chart.data.cols = buildPieCols(data);
		chart.data.rows = buildPieRows(data);
		chart.options.title = buildChartTitle(data);
		return chart;
	}

	function buildPieCols(data) {
		return [ {
			"id" : 'descriptorId',
			"label" : 'Descriptor',
			"type" : "string",
			"p" : {
				"style" : "font-size:11px"
			},
		}, {
			"id" : 'studentsId',
			"label" : 'Students',
			"type" : "number",
			"p" : {
				"style" : "font-size:11px"
			}
		} ];
	}

	function buildPieRows(data) {
		return _.map(data.indicators, function(indicator) {
			var tags = indicator._tags;
			if (data.indicators.length > 1) {
				tags = _.filter(tags, function(tag) {
					return _.values(data.metadata.tags[tag._category]).length > 1;
				});
			}
			var descriptor = _.pluck(tags, 'description').join(' ');
			return {
				"c" : [ {
					"v" : descriptor,
					"p" : {
						"style" : "font-size:11px"
					}
				}, {
					"v" : indicator.value,
					"p" : {
						"style" : "font-size:11px"
					}
				} ]
			};
		});
	}

	/**
	 * Area Chart
	 */

	function buildAreaChart(data) {
		var chart = buildLegendChart();
		chart.type = 'AreaChart';
		chart.data.cols = buildColumnCols(data);
		chart.data.rows = buildColumnRows(data);
		chart.options.title = buildChartTitle(data);
		return chart;
	}

	/**
	 * Line Chart
	 */

	function buildLineChart(data) {
		var chart = buildLegendChart();
		chart.type = 'LineChart';
		chart.data.cols = buildColumnCols(data);
		chart.data.rows = buildColumnRows(data);
		chart.options.title = buildChartTitle(data);
		return chart;
	}

	/**
	 * Columns Chart
	 */

	function buildColumnChart(data) {
		var chart = buildLegendChart();
		chart.type = 'ColumnChart';
		chart.data.cols = buildColumnCols(data);
		chart.data.rows = buildColumnRows(data);
		chart.options.title = buildChartTitle(data);
		return chart;
	}

	function buildColumnCols(data) {
		var result = [ {
			"id" : 'yearId',
			"label" : 'Year',
			"type" : "string",
			"p" : {
				"style" : "font-size:11px"
			},
		} ];

		var categories = _.values(data.metadata.categories);
		// Data categories
		var dataCategories = categories.slice(1);

		var tagCollections = _.map(dataCategories, function(cat) {
			return _.values(data.metadata.tags[cat._id]);
		});

		// Generates the combination of tags for each value
		var tagResult = calculateTagColletionsByLevelCombination(tagCollections);

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
		result = result.concat(_.map(titles, function(title) {
			return {
				"id" : title.concat('Id'),
				"label" : title,
				"type" : "number",
				"p" : {
					"style" : "font-size:11px"
				}
			};
		}));

		return result;
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

	function buildColumnRows(data) {

		var categories = _.values(data.metadata.categories);
		// Data categories
		var dataCategories = categories.slice(1);

		var tagCollections = _.map(dataCategories, function(cat) {
			return _.values(data.metadata.tags[cat._id]);
		});

		// Generates the combination of tags for each value
		var tagResult = calculateTagColletionsByLevelCombination(tagCollections);

		var keys = _.map(tagResult, function(tagCollection) {
			return _.pluck(tagCollection, '_id').join();
		});

		var valuesByYear = getValuesByYear(data);

		var yearTags = _.values(data.metadata.tags[categories[0]._id]);

		return _.map(yearTags, function(yrTag) {
			var result = [ {
				"v" : yrTag.name,
				"p" : {
					"style" : "font-size:11px"
				}
			} ];

			result = result.concat(_.map(keys, function(key) {
				return {
					"v" : valuesByYear[yrTag._id][key].value,
					"p" : {
						"style" : "font-size:11px"
					}
				}
			}));
			$log.log('Column row', result);
			return {
				"c" : result
			};
		});

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

	function buildDescriptionTableChart(data) {
		var chart = buildTableChart();
		chart.data.cols = buildDescriptionTableCols(data);
		chart.data.rows = buildDescriptionTableRows(data);
		return chart;
	}

	function buildDescriptionTableCols(data) {
		var categories = _.values(data.metadata.categories);
		// Data categories
		var dataCategories = categories.slice(1);
		var result = [ {
			"id" : 'descriptionId',
			"label" : 'Description',
			"type" : "string",
			"p" : {
				"style" : "font-size:11px"
			},
		} ];
		// Year Tags
		var yearCategory = categories[0];
		var yearTags = _.values(data.metadata.tags[yearCategory._id]);
		result = result.concat(buildYearCols(yearTags));
		return result;
	}

	function buildDescriptionTableRows(data) {
		var yearCat = _.values(data.metadata.categories)[0];
		var yearTags = _.values(data.metadata.tags[yearCat._id]);
		var yearValues = getValuesByKey(data);

		return _.map(_.keys(yearValues), function(key) {
			// Creates a row for each key
			var values = [ {
				"v" : _.pluck(yearValues[key].tags.slice(1).reverse(), 'description')
						.join(' ').concat(' at ').concat(
								yearValues[key].tags[0].description),
				"p" : {
					"style" : "font-size:11px"
				}
			} ].concat(_.map(yearTags, function(yrTag) {
				return {
					"v" : yearValues[key][yrTag.name],
					"p" : {
						"style" : "font-size:11px"
					}
				};
			}));
			return {
				"c" : values
			};
		});
	}

	/**
	 * Summary Table Chart
	 */

	function buildSummaryTableChart(data) {
		var chart = buildTableChart();
		chart.data.cols = buildSummaryTableCols(data);
		chart.data.rows = buildSummaryTableRows(data);
		return chart;
	}

	function buildSummaryTableCols(data) {
		var categories = _.values(data.metadata.categories);
		// Data categories
		var dataCategories = categories.slice(1);
		var result = _.map(dataCategories, function(category) {
			return {
				"id" : category.name,
				"label" : category.name,
				"type" : "string",
				"p" : {
					"style" : "font-size:11px"
				},
			};
		});
		// Year Tags
		var yearCategory = categories[0];
		var yearTags = _.values(data.metadata.tags[yearCategory._id]);
		result = result.concat(buildYearCols(yearTags));
		return result;
	}

	function buildSummaryTableRows(data) {
		var yearCat = _.values(data.metadata.categories)[0];
		var yearTags = _.values(data.metadata.tags[yearCat._id]);
		var yearValues = getValuesByKey(data);

		return _.map(_.keys(yearValues), function(key) {
			// Creates a row for each key
			var values = _.map(yearValues[key].tags, function(tag) {
				return {
					"v" : tag.name,
					"p" : {
						"style" : "font-size:11px"
					}
				}
			}).concat(_.map(yearTags, function(yrTag) {
				// $log.log("YearTag", yrTag, " value ", yearValues[key][yrTag.name]);
				return {
					"v" : yearValues[key][yrTag.name],
					"p" : {
						"style" : "font-size:11px"
					}
				};
			}));
			return {
				"c" : values
			};
		});
	}

	/**
	 * Full Table Chart
	 */

	function buildFullTableChart(data) {
		var chart = buildTableChart();
		chart.data.cols = buildFullTableCols(data);
		chart.data.rows = buildFullTableRows(data);
		return chart;
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

	/**
	 * Legend Chart
	 */
	function buildLegendChart() {
		var chart = buildChart();
		chart.options.legend = "bottom";
		chart.options, legendMaxLines = 10;
		chart.options.width = "100%";
		chart.options.height = "350px";
		return chart;
	}

	/**
	 * Table Chart
	 */

	function buildTableChart() {
		var chart = buildChart();
		chart.type = 'Table';
		chart.options.pageSize = 20;
		chart.options.page = "enable";
		chart.options.showRowNumber = false;
		chart.options.sort = "enable";
		chart.options.width = "100%";
		chart.options.height = "100%";
		return chart;
	}

	/**
	 * Chart
	 */

	function buildChart() {
		return {
			"displayed" : true,
			"data" : {},
			"options" : {
				"allowHtml" : "true",
			}
		};
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

	function buildYearCols(yearTags) {
		return _.map(yearTags, function(yearTag) {
			return {
				"id" : yearTag.name,
				"label" : yearTag.name,
				"type" : "number",
				"p" : {
					"style" : "font-size:11px"
				}
			}
		});
	}

	return factory;
});