app.controller("StudentsStaffCtrl", function($scope, $log, $location) {
	$log.info("University Staff Controller loaded!");
	$scope.activePath = $location.path();
	$scope.tagCategoryNames = [ 'YR', 'IT', 'IN', 'UP', 'NA', 'GE' ];
	$scope.title = "University Staff";
	$log.log("activePath", $scope.activePath);

});