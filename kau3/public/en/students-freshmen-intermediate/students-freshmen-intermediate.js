app.controller("StudentsFreshmenIntermediateCtrl", function($scope, $log, $location) {
	$log.info("Students Freshmen Intermediate Diploma Controller loaded!");
	$scope.activePath = $location.path();
	$scope.tagCategoryNames = [ 'YR', 'SS', 'DS', 'SY', 'IN', 'IT', 'NA', 'GE' ];
	$scope.title = "Freshmen Intermediate Diploma Students";
	$log.log("activePath", $scope.activePath);

});