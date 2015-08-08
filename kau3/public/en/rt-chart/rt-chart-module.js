/**
 * Chart Modulefile
 */

var RTChartModule = angular.module('RTChartModule', []);

RTChartModule.directive('rtChart', function() {

	return {
		restrict : 'AEC',
		templateUrl : './rt-chart/rt-chart.html',
		controller : 'RTChartCtrl',
		scope : {
			tagCategoryNames : '='
		}
	};
});

RTChartModule.controller('RTChartCtrl',
		function($scope, $log, $q, $http, usSpinnerService, //
		ModelFactory, ChartBuilderFactory) {
			$log.info('Chart Controller Loaded!');

			$log.info('TagCategoryNames', $scope.tagCategoryNames);
			
			/**
			 * Initialization
			 */
			$scope.filterShow = false;
			$scope.filterCategories = [];
			$scope.filterModel = [];

			loadFilterCategories($scope.tagCategoryNames);

			/**
			 * Filter
			 */

			function loadFilterCategories(names) {
				ModelFactory.getTagCategoriesForNames(names)//
				.then(configFilter);
			}

			function configFilter(data) {
				$log.info("Categories loaded!");
				var categories = data.data;
				$scope.filterCategories = _.sortBy(categories, function(cat) {
					return $scope.tagCategoryNames.indexOf(cat.name);
				});
				$scope.unselectAll();
				return data;
			}

			function setAll(selection) {
				$scope.filterModel = _.reduce($scope.filterCategories,
						function(result, cat) {
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
				return _.reduce(_.values($scope.filterCategories),
						function(result, cat) {
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
				$scope.filterModel = _.reduce($scope.filterCategories,
						function(result, cat) {
							var tags = _.sortBy(cat._tags, 'order');
							result[cat._id] = _.reduce(tags, function(result2, tag) {
								result2[tag._id] = tags.indexOf(tag) == 0;
								return result2;
							}, []);
							return result;
						}, []);
			}

			$scope.applyFilter = function() {
				usSpinnerService.spin('spinner-1');
				var filterPath = getFilterPath();
				ModelFactory.getIndicatorsFor(filterPath)//
				.then(
						function(res) {
							var categoriesById = _.indexBy(getSelectedCategories(), '_id');
							var tagsByCategoryBiId = _.reduce(_.values(categoriesById),
									function(result, cat) {
										var tags = _.sortBy(cat._tags, 'order');
										result[cat._id] = _.indexBy(_.filter(tags, function(tag) {
											return $scope.filterModel[cat._id][tag._id];
										}), '_id');
										return result;
									}, []);
							var metadata = {
								categories : categoriesById,
								tags : tagsByCategoryBiId
							};
							// $log.log('indicators ', res.data);
							// $log.log('metadata ', metadata);
							$scope.chart = $scope.chartBuilder({
								indicators : res.data,
								metadata : metadata
							});
							usSpinnerService.stop('spinner-1');
							$scope.filterShow = false;
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