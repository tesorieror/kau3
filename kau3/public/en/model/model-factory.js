/**
 * New node file
 */

app.factory('ModelFactory', function($log, $http) {

	var factory = {};

	function getTagCategoriesForNames(namesPath) {
		$log.info("Loading Tag Categories for names " + namesPath);
		return $http.get('/tagCategory/name/' + namesPath);
	}

	function getIndicatorsFor(filterPath) {
		$log.log("Loading Indicators for tags", filterPath);
		return $http.get('/indicator/tag/' + filterPath);
	}

	/**
	 * Public functions
	 */
	factory.getTagCategoriesForNames = getTagCategoriesForNames;
	factory.getIndicatorsFor = getIndicatorsFor;

	return factory;
});