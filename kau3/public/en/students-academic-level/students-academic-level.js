app
		.controller(
				"StudentsAcademicLevelCtrl",
				function($scope, $http, $q, $log, $timeout, usSpinnerService, ModelFactory, FullTableBuilder) {
					$log.info("Students Academic Level Controller loaded!");

					/**
					 * Initialization
					 */
					var tagCategoryNames = [ 'YR', 'IT', 'SS', 'GR', 'NA', 'GE' ];

					$scope.title = "Students by Academic Level";
					$scope.filterShow = false;
					$scope.filterCategories = [];
					$scope.filterModel = [];

					loadFilterCategories(tagCategoryNames);

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
							return tagCategoryNames.indexOf(cat.name);
						});
						$scope.unselectAll();
						$scope.filterChanged = function(cat, tag) {
							$log.log("Filter category changed", cat);
							$log.log("Filter tag changed", tag);
						};
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
						$log.log('Filter Model', $scope.filterModel);
					}

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
									var categoriesById = _
											.indexBy(getSelectedCategories(), '_id');
									var tagsByCategoryBiId = _.reduce(_.values(categoriesById),
											function(result, cat) {
												var tags = _.sortBy(cat._tags, 'order');
												result[cat._id] = _.indexBy(_.filter(tags,
														function(tag) {
															return $scope.filterModel[cat._id][tag._id];
														}), '_id');
												return result;
											}, []);
									var metadata = {
										categories : categoriesById,
										tags : tagsByCategoryBiId
									};
									$log.log('indicators ', res.data);
									$log.log('metadata ', metadata);
									$scope.chart = $scope.chartBuilder({
										indicators : res.data,
										metadata : metadata
									});
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

					$scope.chartBuilder = FullTableBuilder.build;

					//
					// /**
					// * Filter
					// */
					//
					//
					// $scope.applyFilter = function() {
					// $log.log(TagFilterFactory.getFilterPath());
					// $log.log(TagFilterFactory.getNotEmptyTagCategories());
					//
					// $scope.chart = $scope.chartType.build(TagFilterFactory
					// .getNotEmptyTagCategories());
					//
					// }
					//
					// /**
					// * Chart type
					// */
					//
					// $scope.chartTypes = [ {
					// name : 'Full Table',
					// icon : 'glyphicon glyphicon-list',
					// builder : function() {
					// }
					// }, {
					// name : 'Summary Table',
					// icon : 'glyphicon glyphicon-menu-hamburger',
					// builder : function() {
					// }
					// }, {
					// name : 'Description Table',
					// icon : 'glyphicon glyphicon-align-justify',
					// builder : function() {
					// }
					// }, {
					// name : 'Column Chart',
					// icon : 'glyphicon glyphicon-object-align-bottom',
					// builder : function() {
					// }
					// }, {
					// name : 'Line Chart',
					// icon : 'glyphicon glyphicon-stats',
					// builder : function() {
					// }
					// }, {
					// name : 'Pie Chart',
					// icon : 'glyphicon glyphicon-cd',
					// builder : function() {
					// }
					// } ];
					//
					// $scope.chartType = $scope.chartTypes[0];

					/**
					 * Chart
					 */

					//
					// $scope.chartFactories = [ indicatorTable, indicatorTable2,
					// indicatorTable3, studentAcademicLevelLines,
					// studentAcademicLevelColumn, studentAcademicLevelPie ];
					//
					// $scope.chartFactory = $scope.chartFactories[0];
					//
					// $scope.radioModel = $scope.chartFactories[0];
					//
					// var tagCategoryNames = [ 'YR', 'IT', 'SS', 'GR', 'NA', 'GE' ];
					//
					// $http.get('/tagCategory/name/' + tagCategoryNames.join())//
					// .then(function(data) {
					// var tagCategories = data.data;
					// $scope.tagCategories = tagCategories;
					// _.each(tagCategories, function(tc) {
					// $scope.tagFilter.model[tc._id] = [];
					// _.each(tc._tags, function(t) {
					// $scope.tagFilter.model[tc._id][t._id] = false;
					// });
					// $scope.tagFilter.model[tc._id][_.find(tc._tags, function(t) {
					// return t.order === 1;
					// })._id] = true;
					// });
					//
					// // $scope.applyFilter();
					//
					// });
					//
					// /**
					// * Spinner
					// */
					//
					// /**
					// * Apply Filter
					// */
					//
					// $scope.applyFilter = function() {
					// // $scope.tagFilter.open = false;
					// $scope.showTable = false;
					// usSpinnerService.spin('spinner-1');
					//
					// var filter = _.map($scope.tagCategories, function(tc) {
					// return _.pluck(_.filter(tc._tags, function(t) {
					// return $scope.tagFilter.model[tc._id][t._id];
					// }), '_id').join();
					// }).join('/');
					//
					// filter = filter.replace(/\/\//g, "/*/");
					//
					// $http.get('/indicator/tag/' + filter)//
					// .then(function(res) {
					// console.info("Data retrieved: ", res.data.length, " indicators");
					// // console.log("Indicators", res);
					// var tagCategories = _.filter($scope.tagCategories, function(cat) {
					// return _.filter(cat._tags, function(tag) {
					// return $scope.tagFilter.model[cat._id][tag._id];
					// }).length > 0;
					// });
					// // console.log("Chart Factory", $scope.chartFactory);
					// $scope.chart = $scope.chartFactory.build({
					// indicators : res.data,
					// categories : tagCategories,
					// tagFilterModel : $scope.tagFilter.model
					// });
					// // console.log($scope.chart);
					// });
					// };
					//
					// $scope.checkFirst = function(cat) {
					// _.each(cat._tags, function(t) {
					// $scope.tagFilter.model[cat._id][t._id] = false;
					// });
					// $scope.tagFilter.model[cat._id][_.first(_
					// .sortBy(cat._tags, 'order'))._id] = true;
					// }
					//
					// $scope.uncheck = function(cat) {
					// _.each(cat._tags, function(t) {
					// $scope.tagFilter.model[cat._id][t._id] = false;
					// });
					// }
					//
					// $scope.check = function(cat) {
					// _.each(cat._tags, function(t) {
					// $scope.tagFilter.model[cat._id][t._id] = true;
					// });
					// }
					//
					// $scope.setChartFactory = function(factory) {
					// $scope.chartFactory = factory;
					// // $scope.applyFilter();
					// }
					//
					// $scope.filterChanged = function(tag) {
					// // console.log("Tag", tag);
					// }
					//
					// $scope.chartReady = function(chartWrapper) {
					// console.log("ready");
					// usSpinnerService.stop('spinner-1');
					// $scope.showTable = true;
					// }
					//
					// $scope.checkFirsts = function() {
					// _.each($scope.tagCategories, function(cat) {
					// $scope.checkFirst(cat);
					// });
					// }
					//
					// $scope.checkAll = function() {
					// _.each($scope.tagCategories, function(cat) {
					// $scope.check(cat);
					// });
					// }
					//
					// $scope.uncheckAll = function() {
					// _.each($scope.tagCategories, function(cat) {
					// $scope.uncheck(cat);
					// });
					// }
				});