app.controller("StudentsAcademicLevelCtrl", function($scope, $log) {
	$log.info("Students Academic Level Controller loaded!");

	$scope.tagCategoryNames = [ 'YR', 'IT', 'SS', 'GR', 'NA', 'GE' ];
	$scope.title = "Students by Academic Level";

});