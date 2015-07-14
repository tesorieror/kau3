/**
 * New node file
 */

app.controller('RouteCtrl', function($scope, $route, $routeParams, $location) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
})

app.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/main', {
		templateUrl : './main/main.html',
		controller : 'MainCtrl'
	}).when('/aboutUnit', {
		templateUrl : './about-unit/about-unit.html',
		controller : 'AboutUnitCtrl'
	}).when('/goalOfUnit', {
		templateUrl : './goal-of-unit/goal-of-unit.html',
		controller : 'GoalOfUnitCtrl'
	}).when('/students-academic-level', {
		templateUrl : './students-academic-level/students-academic-level.html',
		controller : 'StudentsAcademicLevelCtrl'
	}).when('/informationNotAvailable', {
		templateUrl : './information-not-available/information-not-available.html',
		controller : 'InformationNotAvailableCtrl'
	}).otherwise({
		redirectTo : '/index.html'
	});
	// configure html5 to get links working on jsfiddle
	// $locationProvider.html5Mode(true);
});