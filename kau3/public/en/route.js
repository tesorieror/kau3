/**
 * New node file
 */

app.controller('RouteCtrl', function($scope, $route, $routeParams, $location) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
})

app
		.config(function($routeProvider, $locationProvider) {
			$routeProvider
					.when('/main', {
						templateUrl : './main/main.html',
						controller : 'MainCtrl'
					})
					.when('/aboutUnit', {
						templateUrl : './about-unit/about-unit.html',
						controller : 'AboutUnitCtrl'
					})
					.when('/goalOfUnit', {
						templateUrl : './goal-of-unit/goal-of-unit.html',
						controller : 'GoalOfUnitCtrl'
					})
					.when(
							'/students-academic-level',
							{
								templateUrl : './students-academic-level/students-academic-level.html',
								controller : 'StudentsAcademicLevelCtrl'
							})
					.when('/students-university', {
						templateUrl : './students-university/students-university.html',
						controller : 'StudentsUniversityCtrl'
					})
					.when('/students-community', {
						templateUrl : './students-community/students-community.html',
						controller : 'StudentsCommunityCtrl'
					})
					.when(
							'/students-community-service',
							{
								templateUrl : './students-community-service/students-community-service.html',
								controller : 'StudentsCommunityServiceCtrl'
							})
					.when('/students-staff', {
						templateUrl : './students-staff/students-staff.html',
						controller : 'StudentsStaffCtrl'
					})
					.when(
							'/students-freshmen-undergraduate',
							{
								templateUrl : './students-freshmen-undergraduate/students-freshmen-undergraduate.html',
								controller : 'StudentsFreshmenUndergraduateCtrl'
							})
					.when(
							'/students-freshmen-intermediate',
							{
								templateUrl : './students-freshmen-intermediate/students-freshmen-intermediate.html',
								controller : 'StudentsFreshmenIntermediateCtrl'
							})

					.when(
							'/informationNotAvailable',
							{
								templateUrl : './information-not-available/information-not-available.html',
								controller : 'InformationNotAvailableCtrl'
							}).otherwise({
						redirectTo : '/index.html'
					});

			// configure html5 to get links working on jsfiddle
			// $locationProvider.html5Mode(true);
		});