app
		.controller(
				"StudentsFreshmenPostGraduateCollegeSectionSpecializationCtrl",
				function($scope, $log, $location) {
					$log
							.info("Freshmen Post Graduate Students by College Section Specialization Controller loaded!");
					$scope.activePath = $location.path();
					$scope.tagCategoryNames = [ 'YR', 'SS', 'DS', 'GR', 'IT', 'IN', 'CO',
							'SE', 'SP', 'NA', 'GE' ];
					$scope.title = "Freshmen Post Graduate Students by College Section Specialization";
					$log.log("activePath", $scope.activePath);
				});