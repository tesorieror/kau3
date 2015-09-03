/**
 * App file
 */

var initApp = angular.module("initApp", [ "ui.bootstrap", "googlechart", "ngRoute", 'angularSpinner', "ngAnimate" ]);

/**
 * Avoid cache (review this for optimization)
 */
initApp.config([ '$httpProvider', function($httpProvider) {
	// initialize get if not there
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}
	// disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
} ]);

initApp.controller("InitAppCtrl", function($scope, $log, $location, $http) {
	$log.info("Initialize Application Controller loaded!");

	function initialize() {
		$log.info("Initializing");
		return $http.get('/initialize');
	}

	$scope.initState = "NONE";

	$scope.initialize = function() {
		$scope.initState = "PROCESSING";
		initialize().then(function(data) {
			$scope.initState = "DONE";
			$log.info(data);
		}, function(err) {
			$scope.initState = "ERROR";
			$log.error(err);
		});
	};
});