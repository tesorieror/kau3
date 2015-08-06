/**
 * App file
 */

var app = angular.module("app", [ "ui.bootstrap", "googlechart", "ngRoute",
		'angularSpinner', "ngAnimate", 'TagFilterModule', 'ChartBuilderModule' ]);

/**
 * Avoid cache (review this for optimization)
 */
app.config([ '$httpProvider', function($httpProvider) {
	// initialize get if not there
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}
	// disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
} ]);

app.filter("filterFromYears", function() {
	return function(years, toYear) {
		var answer = [];
		angular.forEach(years, function(value, key) {
			if (value <= toYear)
				answer.push(value);
		});
		return answer;
	};
});

app.filter("filterToYears", function() {
	return function(years, fromYear) {
		var answer = [];
		angular.forEach(years, function(value, key) {
			if (value >= fromYear)
				answer.push(value);
		});
		return answer;
	};
});