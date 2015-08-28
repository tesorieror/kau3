app.controller("StudentsFreshmenUndergraduateCtrl",
		function($scope, $log, $location) {
			$log.info("Freshmen Undergesuate Students Controller loaded!");
			$scope.activePath = $location.path();
			$scope.tagCategoryNames = [ 'YR', 'SS', 'DS', 'SY', 'IN', 'IT', 'NA',
					'GE' ];
			$scope.title = "Freshmen Undergraduate Students";
			$log.log("activePath", $scope.activePath);

		});