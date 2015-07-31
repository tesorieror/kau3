/**
 * New node file
 */

// var app = angular.module("app", [ "ui.bootstrap", "googlechart", "ngRoute",
// "ngAnimate" ]);
var app = angular.module("app", [ "ui.bootstrap", "ngRoute", "ngAnimate" ]);

/**
 * Avoid cache (review this for optimization)
 */
app.config([ '$httpProvider', function($httpProvider) {
	// initialize get if not there
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}
	// disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
} ]);

/**
 * Full Table Factory
 */

app.factory('FullTableFactory', function($http, $q, $log) {

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
			"displayed" : false,
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

		result = _.map(_.values(categories), function(category) {
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

/**
 * Tag Filter
 */

app.factory('TagFilterFactory', function($http, $q, $log) {

	var factory = {};

	factory.title = 'Filter';
	factory.collapsed = false;

	var model = [];
	var tagCategories = [];

	function setTagCategories(pTagCategories) {
		tagCategories = pTagCategories;
		model = [];
		_.each(tagCategories, function(tc) {
			model[tc._id] = [];
			_.each(tc._tags, function(t) {
				model[tc._id][t._id] = false;
			});
		});
	}

	function setSelection(selected) {
		_.each(tagCategories, function(tc) {
			_.each(tc._tags, function(t) {
				model[tc._id][t._id] = selected;
			});
		});
	}

	function selectFirsts() {
		_.each(tagCategories, function(tc) {
			model[tc._id][_.find(tc._tags, function(t) {
				return t.order === 1;
			})._id] = true;
		});
		// console.log("Model", model);
	}

	function selectAll() {
		setSelection(true);
		// console.log("Model", model);
	}

	function unselectAll() {
		setSelection(false);
		// console.log("Model", model);
	}

	function getFilterPath() {
		// console.log('GetFilterPath');
		// console.log("Tag categories", tagCategories);
		// console.log("Model", model);

		var results = _.map(tagCategories, function(tc) {
			return _.pluck(_.filter(tc._tags, function(t) {
				return model[tc._id][t._id];
			}), '_id').join();
		}).join('/').replace(/\/\//g, "/*/");

		console.log("Filter Path", results);
		return results;
	}

	function getNotEmptyTagCategories() {
		return _.filter(tagCategories, function(cat) {
			return _.filter(cat._tags, function(tag) {
				return model[cat._id][tag._id];
			}).length > 0;
		});
	}

	/**
	 * Public functions
	 */

	factory.setTagCategories = setTagCategories;
	factory.unselectAll = unselectAll;
	factory.selectAll = selectAll;
	factory.selectFirsts = selectFirsts;
	factory.getFilterPath = getFilterPath;
	factory.getNotEmptyTagCategories = getNotEmptyTagCategories;

	return factory;
});

/**
 * Main Controller
 */

app
		.controller(
				"TableSampleCtrl",
				function($scope, $http, $q, $log, $timeout, FullTableFactory, TagFilterFactory) {
					$log.info("MainCtrl controller loaded!");

					var tagCategoryNames = [ 'YR', 'IT', 'SS', 'GR', 'NA', 'GE' ];

					$scope.tagCategories = [];

					$scope.tagFilter = TagFilterFactory;

					/**
					 * Apply Filter
					 */

					$scope.applyFilter = function() {

						function buildChart(info) {
							console.log("BuildChart");

							console.log("Draw table");
							var data = new google.visualization.DataTable();

							console.log(_.values(info.categories));

							_.each(_.values(info.categories), function(cat) {
								data.addColumn('string', cat.description);
							});
							data.addColumn('number', "Students");

							var categoryIdOrder = _.pluck(info.categories, '_id');
							data.addRows(_.map(info.indicators, function(indicator) {
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
								return values;
							}));

							var table = new google.visualization.Table(document
									.getElementById('table_div'));

							table.draw(data, {
								showRowNumber : true,
								width : '100%',
								height : '100%'
							});
						}

						console.log('Loading Tag Indicators ...');
						$http.get('/indicator/tag/' + $scope.tagFilter.getFilterPath())//
						.then(function(res) {
							console.log('Indicators loaded!');
							// $scope.chart = FullTableFactory.build({
							// indicators : res.data,
							// categories : $scope.tagFilter.getNotEmptyTagCategories(),
							// tagFilterModel : $scope.tagFilter.model
							// });
							// console.log($scope.chart);

							buildChart({
								indicators : res.data,
								categories : $scope.tagFilter.getNotEmptyTagCategories(),
								tagFilterModel : $scope.tagFilter.model
							});
							
							
						});
					};

					/**
					 * Chart Ready
					 */

					$scope.chartReady = function(chartWrapper) {
						console.log("Chart Ready!", chartWrapper);
					};

					/**
					 * Initialization
					 */

					console.log('Loading Tag Categories...');
					$http.get('/tagCategory/name/' + tagCategoryNames.join())//
					.then(function(data) {
						console.log('Tag Categories loaded!');
						$scope.tagFilter.setTagCategories(data.data);
						return $scope.tagFilter;
					})//
					.then($scope.tagFilter.selectAll()) //
					// .then($scope.applyFilter()) //
					// .done()
					;
				});
