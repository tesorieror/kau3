app.controller("StudentsUniversityCtrl", function($scope, $log, $location) {
	$log.info("Students By University Controller loaded!");
	$scope.activePath = $location.path();
	$scope.tagCategoryNames = [ 'YR', 'IT', 'IN', 'SS', 'AL', 'GE' ];
	$scope.title = "Students by University";
	$log.log("activePath", $scope.activePath);

});