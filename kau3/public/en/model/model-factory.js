/**
 * New node file
 */

app.factory('ModelFactory', function($log, $http) {

	var factory = {};
	
	function getTagCategoriesForNames(namesPath) {
		$log.info("Loading Tag Categories for names " + namesPath);
		return $http.get('/tagCategory/name/' + namesPath);
	}

	// function getIndicatorsFor(filterPath) {
	// $log.log("Loading Indicators for tags", filterPath);
	// return $http.get('/indicator/tag/' + filterPath);
	// }

	function getIndicators(path, filter) {
		$log.log("Loading Indicators for ", filter, "from", path);
		return $http.get(path + filter);
	}

	function countIndicators(path, filter) {
		$log.log("Counting Indicators for ", filter, "from", path);
		return $http.get(path + filter);
	}
	
	
	/**
	 * Public functions
	 */
	factory.getTagCategoriesForNames = getTagCategoriesForNames;
	factory.getIndicators = getIndicators;
	factory.countIndicators = countIndicators;

	return factory;
});