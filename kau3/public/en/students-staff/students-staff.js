app.controller("StudentsStaffCtrl", function($scope, $log, $location, ModelFactory) {
	$log.info("University Staff Controller loaded!");
	$scope.activePath = $location.path();
	var tagCategoryNames = [ 'YR', 'IT', 'IN', 'UP', 'NA', 'GE' ];
	
	
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
		$log.log('Patched Categories', patchedTagCategories);
		$scope.tagCategories = patchedTagCategories;
	});
	
	
	
	$scope.title = "University Staff";
	$log.log("activePath", $scope.activePath);

});