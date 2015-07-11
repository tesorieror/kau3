/**
 * New node file
 */

app.controller('GoalOfUnitCtrl', function($scope, $log, $location) {
	$scope.activePath = $location.path();
	$log.log('Active path:', $scope.activePath);
});