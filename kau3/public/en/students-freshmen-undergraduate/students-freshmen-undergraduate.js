app.controller("StudentsFreshmenUndergraduateCtrl", function($scope, $log, $location, ModelFactory) {
	$log.info("Freshmen Undergesuate Students Controller loaded!");
	$scope.activePath = $location.path();
	var tagCategoryNames = [ 'YR', 'SS', 'DS', 'SY', 'IN', 'IT', 'NA', 'GE' ];

	$scope.tagCategories = [];
	/**
	 * Load Categories
	 */
	ModelFactory.getTagCategoriesForNames(tagCategoryNames)//
	.then(function(data) {
		// $log.log("data.data", data.data);
		var patchedTagCategories = _.sortBy(data.data, function(cat) {
			return tagCategoryNames.indexOf(cat.name);
		});

		var ssCat = _.detect(patchedTagCategories, function(cat) {
			return cat.name == "SS";
		});
		ssCat._tags = _.filter(ssCat._tags, function(t) {
			return t.name == "FR";
		});

		var dsCat = _.detect(patchedTagCategories, function(cat) {
			return cat.name == "DS";
		});
		dsCat._tags = _.filter(dsCat._tags, function(t) {
			return t.name == "UG";
		});

		$log.log('Patched Categories', patchedTagCategories);
		$scope.tagCategories = patchedTagCategories;
	});

	$scope.title = "Freshmen Undergraduate Students";
	$log.log("activePath", $scope.activePath);

});