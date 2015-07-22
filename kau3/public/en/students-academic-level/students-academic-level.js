app
		.controller(
				"StudentsAcademicLevelCtrl",
				function($scope, $http, $q, $log, indicatorTable, indicatorTable2, indicatorTable3, studentAcademicLevelLines, $timeout) {
					$log.info("Students Academic Level controller loaded...");

					$scope.title = "Students Academic Level";

					$scope.tagCategories = [];

					$scope.tagFilter = {
						title : 'Filter',
						open : true,
						model : []
					};

					var tagCategoryNames = [ 'YR', 'IT', 'SS', 'GR', 'NA', 'GE' ];

					var chartBuilder = indicatorTable;
					$scope.chartTypeModel = 'FullTable';

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
					});

//					tagFilter.model[tagCategories[0]._id]
					
					
					$scope.applyFilter = function() {
						$scope.tagFilter.open = false;
						var filter = _.map($scope.tagCategories, function(tc) {
							return _.pluck(_.filter(tc._tags, function(t) {
								return $scope.tagFilter.model[tc._id][t._id];
							}), '_id').join();
						}).join('/');
						$http.get('/indicator/tag/' + filter)//
						.then(function(res) {
							$scope.chart = chartBuilder.build({
								indicators : res.data,
								categories : $scope.tagCategories,
								tagFilterModel : $scope.tagFilter.model
							});
						});
					};

					$scope.uncheck = function(cat) {
						_.each(cat._tags, function(t) {
							$scope.tagFilter.model[cat._id][t._id] = false;
						});
						$scope.tagFilter.model[cat._id][_.first(_
								.sortBy(cat._tags, 'order'))._id] = true;
						console.log(cat);
					}

					$scope.check = function(cat) {
						_.each(cat._tags, function(t) {
							$scope.tagFilter.model[cat._id][t._id] = true;
						});
						console.log(cat);
					}

					$scope.setFullTableChart = function() {
						chartBuilder = indicatorTable;
						$scope.applyFilter();
					}

					$scope.setSummaryTableChart = function() {
						chartBuilder = indicatorTable2;
						$scope.applyFilter();
					}

					$scope.setDescriptionTableChart = function() {
						chartBuilder = indicatorTable3;
						$scope.applyFilter();
					}

					$scope.setBarChart = function() {

					}

					$scope.setLineChart = function() {
						chartBuilder = studentAcademicLevelLines;
						$scope.applyFilter();
					}

					$scope.setPieChart = function() {

					}

				});