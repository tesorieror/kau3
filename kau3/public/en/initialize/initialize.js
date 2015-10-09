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

initApp.controller("InitAppCtrl", function($scope, $log, $location, $http, $interval) {
	$log.info("Initialize Application Controller loaded!");

	$scope.enableStart = true;

	function check() {
		if ($scope.enableStart)
			return;
		$log.info("Checking initialization");
		return $http.get('/initialize/check').then(function(res) {
			$scope.initState = res.data.state;
			$scope.error = '';
			if (res.data.state != 'PROCESSING') {
				$scope.enableStart = true;
			}
			// $log.info(res);
		}, function(err) {
			$scope.initState = err.data.state;
			$scope.error = err.data.message;
			$log.error(err);
		});
	}

	function start() {
		$log.info("Initialization started");
		return $http.get('/initialize/start').then(function(res) {
			$scope.initState = res.data.state;
			$scope.error = '';
			$scope.enableStart = false;
			// $log.info(res);
		}, function(err) {
			$scope.initState = err.data.state;
			$scope.error = err.data.message;
			$scope.enableStart = true;
			$log.error(err);
		});
	}

	$scope.initState = "NONE";

	$scope.check = function() {
		check()
	};

	$scope.start = function() {
		start()
	};

	$interval(check, 1000);

});