app
		.controller(
				"StudentsAcademicLevelCtrl",
				function($scope, $http, $q, $log, usSpinnerService, indicatorTable, indicatorTable2, indicatorTable3, studentAcademicLevelLines, studentAcademicLevelColumn, studentAcademicLevelPie, $timeout) {
					$log.info("Students Academic Level controller loaded...");

					$scope.showTable = false;

					$scope.title = "Students by Academic Level";

					$scope.tagCategories = [];

					$scope.tagFilter = {
						title : 'Filter',
						open : false,
						model : []
					};

					$scope.chartFactories = [ indicatorTable, indicatorTable2,
							indicatorTable3, studentAcademicLevelLines,
							studentAcademicLevelColumn, studentAcademicLevelPie ];

					$scope.chartFactory = $scope.chartFactories[0];

					$scope.radioModel = $scope.chartFactories[0];

					var tagCategoryNames = [ 'YR', 'IT', 'SS', 'GR', 'NA', 'GE' ];

					$http.get('/tagCategory/name/' + tagCategoryNames.join())//
					.then(function(data) {
						var tagCategories = data.data;
						$scope.tagCategories = tagCategories;
						_.each(tagCategories, function(tc) {
							$scope.tagFilter.model[tc._id] = [];
							_.each(tc._tags, function(t) {
								$scope.tagFilter.model[tc._id][t._id] = false;
							});
							$scope.tagFilter.model[tc._id][_.find(tc._tags, function(t) {
								return t.order === 1;
							})._id] = true;
						});

						// $scope.applyFilter();

					});

					/**
					 * Spinner
					 */

					/**
					 * Apply Filter
					 */

					$scope.applyFilter = function() {
						// $scope.tagFilter.open = false;
						$scope.showTable = false;
						usSpinnerService.spin('spinner-1');

						var filter = _.map($scope.tagCategories, function(tc) {
							return _.pluck(_.filter(tc._tags, function(t) {
								return $scope.tagFilter.model[tc._id][t._id];
							}), '_id').join();
						}).join('/');

						filter = filter.replace(/\/\//g, "/*/");

						$http.get('/indicator/tag/' + filter)//
						.then(function(res) {
							// console.log("Indicators", res);
							var tagCategories = _.filter($scope.tagCategories, function(cat) {
								return _.filter(cat._tags, function(tag) {
									return $scope.tagFilter.model[cat._id][tag._id];
								}).length > 0;
							});
							// console.log(res.data.length);

							console.log("Chart Factory", $scope.chartFactory);

							$scope.chart = $scope.chartFactory.build({
								indicators : res.data,
								categories : tagCategories,
								tagFilterModel : $scope.tagFilter.model
							});
							console.log($scope.chart);
						});
					};

					$scope.checkFirst = function(cat) {
						_.each(cat._tags, function(t) {
							$scope.tagFilter.model[cat._id][t._id] = false;
						});
						$scope.tagFilter.model[cat._id][_.first(_
								.sortBy(cat._tags, 'order'))._id] = true;
					}

					$scope.uncheck = function(cat) {
						_.each(cat._tags, function(t) {
							$scope.tagFilter.model[cat._id][t._id] = false;
						});
					}

					$scope.check = function(cat) {
						_.each(cat._tags, function(t) {
							$scope.tagFilter.model[cat._id][t._id] = true;
						});
					}

					$scope.setChartFactory = function(factory) {
						$scope.chartFactory = factory;
						// $scope.applyFilter();
					}

					$scope.filterChanged = function(tag) {
						// console.log("Tag", tag);
					}

					$scope.chartReady = function(chartWrapper) {
						console.log("ready");
						usSpinnerService.stop('spinner-1');
						$scope.showTable = true;
					}

					$scope.checkFirsts = function() {
						_.each($scope.tagCategories, function(cat) {
							$scope.checkFirst(cat);
						});
					}

					$scope.checkAll = function() {
						_.each($scope.tagCategories, function(cat) {
							$scope.check(cat);
						});
					}

					$scope.uncheckAll = function() {
						_.each($scope.tagCategories, function(cat) {
							$scope.uncheck(cat);
						});
					}
				});