app.controller("StudentsCommunityCtrl", function($scope, $log, $location) {
	$log.info("Students By Communities Controller loaded!");
	$scope.activePath = $location.path();
	$scope.tagCategoryNames = [ 'YR', 'CC', 'PE', 'GE' ];
	$scope.title = "Students by Community";
	$log.log("activePath", $scope.activePath);
});