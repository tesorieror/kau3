/**
 * Chart Modulefile
 */

var RTChartModule = angular.module('RTChartModule', []);

RTChartModule.directive('rtChart', function() {

	return {
		restrict : 'AEC',
		templateUrl : './rt-chart-2/rt-chart.html',
		controller : 'RTChartCtrl',
		scope : {
			// tagCategoryNames : '=',
			tagCategories : '=',
			path : '@'
		}
	};
});

RTChartModule.controller('RTChartCtrl',
		function($scope, $log, $q, $http, $modal, usSpinnerService, ModelFactory, ChartBuilderFactory) {
			$log.info('Chart Controller Loaded!');
			$log.info('TagCategoryNames', $scope.tagCategoryNames);

			/**
			 * Initialization
			 */
			$scope.filterShow = false;
			$scope.filterCategories = [];
			$scope.filterModel = [];

			// loadFilterCategories($scope.tagCategoryNames);

			/**
			 * Filter
			 */

			// function loadFilterCategories(names) {
			// ModelFactory.getTagCategoriesForNames(names)//
			// .then(configFilter);
			// }
			/**
			 * Updates filter
			 */

			$scope.$watch("tagCategories", function(newValue, oldValue) {
				$log.log("categories changed!");
				// $scope.updateDependencies(null);
				configFilter(newValue);
			});

			function configFilter(data) {
				$log.info("Categories loaded!");
				// var categories = data.data;
				// $scope.filterCategories = _.sortBy(categories, function(cat) {
				// return $scope.tagCategoryNames.indexOf(cat.name);
				// });
				$scope.filterCategories = data;
				$scope.unselectAll();
				return data;
			}

			function setAll(selection) {
				$scope.filterModel = _.reduce($scope.filterCategories, function(result, cat) {
					var tags = _.sortBy(cat._tags, 'order');
					result[cat._id] = _.reduce(tags, function(result2, tag) {
						result2[tag._id] = selection;
						return result2
					}, []);
					return result;
				}, []);
				// $log.log('Filter Model', $scope.filterModel);
			}

			$scope.allHasSelection = function() {
				return _.reduce(_.values($scope.filterCategories), function(result, cat) {
					var hasSelection = _.reduce(cat._tags, function(result, tag) {
						return $scope.filterModel[cat._id][tag._id] || result;
					}, false);
					return hasSelection && result;
				}, true);
			};

			$scope.unselectAll = function() {
				setAll(false);
			}

			$scope.selectAll = function() {
				setAll(true);
			}

			$scope.selectFirsts = function() {
				$scope.filterModel = _.reduce($scope.filterCategories, function(result, cat) {
					var tags = _.sortBy(cat._tags, 'order');
					result[cat._id] = _.reduce(tags, function(result2, tag) {
						result2[tag._id] = tags.indexOf(tag) == 0;
						return result2;
					}, []);
					return result;
				}, []);
			}

			function getIndicators(filterPath) {

				usSpinnerService.spin('spinner-1');
				ModelFactory.getIndicators($scope.path, filterPath)//
				.then(function(res) {
					var len = res.data.length;
					$log.log(len + " values were retrieved!");
					$log.log("DATA", res.data);

					var start = new Date().getTime();

					$log.log("Before format", new Date().getTime());
					// Format data
					var categoriesById = _.indexBy(getSelectedCategories(), '_id');
					var tagsByCategoryById = _.reduce(_.values(categoriesById), function(result, cat) {
						var tags = _.sortBy(cat._tags, 'order');
						result[cat._id] = _.indexBy(_.filter(tags, function(tag) {
							return $scope.filterModel[cat._id][tag._id];
						}), '_id');
						return result;
					}, []);
					var metadata = {
						categories : categoriesById,
						tags : tagsByCategoryById
					};

					// Draw table

					$log.log("Google charts loaded!");
					$log.log("Before data", new Date().getTime());

					$scope.chartBuilder({
						indicators : res.data,
						metadata : metadata
					}, document.getElementById('table_div'));

					// var data = $scope.chartBuilder({
					// indicators : res.data,
					// metadata : metadata
					// });
					//
					// $log.log("Before draw", new Date().getTime());
					// var table = new
					// google.visualization.Table(document.getElementById('table_div'));
					//
					// table.draw(data, {
					// showRowNumber : false,
					// width : '100%',
					// height : '100%',
					// page : 'enable',
					// pageSize : '20',
					// allowHtml : true
					// });

					$log.log("End", new Date().getTime());
					$log.log("Time:", new Date().getTime() - start, "ms");
					$log.log("Spinner STOP!");
					usSpinnerService.stop('spinner-1');
					$scope.filterShow = false;

				});

			}

			function openModal(data) {
				var modalInstance = $modal.open({
					animation : true,
					templateUrl : 'rt-chart-2/error-modal.html',
					controller : 'ErrorModalCtrl',
					size : 'lg',
					resolve : {
						data : function() {
							return data;
						}
					}
				});
				modalInstance.result.then(function() {
					$log.info('Ok');
					getIndicators();
				}, function() {
					$log.info('Cancelled');
				});
			}

			$scope.applyFilter = function() {
				function addCount(path) {
					return path.substring(0, path.length - 1) + '_count/';
				}
				usSpinnerService.spin('spinner-1');
				var filterPath = getFilterPath();
				ModelFactory.countIndicators(addCount($scope.path), filterPath)//
				.then(function(res) {
					$log.log(res);
					usSpinnerService.stop('spinner-1');
					if (res.data.count > 1000) {
						openModal(res.data);
					} else {
						getIndicators(filterPath);
					}
				}, function(err) {
					$log.error(err);
					usSpinnerService.stop('spinner-1');
				});

			}

			function getFilterPath() {
				var result = _.map($scope.filterCategories, function(tc) {
					var tCols = _.filter(tc._tags, function(t) {
						return $scope.filterModel[tc._id][t._id];
					})
					return tCols.length == 0 ? '*' : _.pluck(tCols, '_id').join();
				}).join('/');
				return result;
			}

			function getSelectedCategories() {
				return _.filter($scope.filterCategories, function(cat) {
					return _.filter(cat._tags, function(tag) {
						return $scope.filterModel[cat._id][tag._id];
					}).length > 0;
				});
			}

			/**
			 * Chart Builders
			 */

			$scope.chartBuilderFactory = ChartBuilderFactory;

			$scope.chartBuilder = ChartBuilderFactory.buildFullTableChart;

		});