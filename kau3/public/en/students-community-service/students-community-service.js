app.controller("StudentsCommunityServiceCtrl", function($scope, $log, $location) {
	$log.info("Universities By Community Services Controller loaded!");
	$scope.activePath = $location.path();
	$scope.tagCategoryNames = [ 'YR', 'CCS', 'PE', 'GE' ];
	$scope.title = "Universities by Community Services";
	$log.log("activePath", $scope.activePath);
});