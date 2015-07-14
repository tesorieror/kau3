app.controller("StudentsAcademicLevelCtrl",
		function($scope, $http, $q, $log, indicatorTable, $timeout) {
			$log.info("Students Academic Level controller loaded...");

			$scope.title = "Students Academic Level";

			$scope.tagCategories = [];

			$scope.tagFilter = {
				title : 'Filter',
				open : true,
				model : []
			};

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
			});

			$scope.applyFilter = function() {
				var filter = _.map($scope.tagCategories, function(tc) {
					return _.pluck(_.filter(tc._tags, function(t) {
						return $scope.tagFilter.model[tc._id][t._id];
					}), '_id').join();
				}).join('/');
				// console.log(filter);
				$http.get('/indicator/tag/' + filter)//
				.then(function(data) {
					console.log(data);
				});
			};
		});