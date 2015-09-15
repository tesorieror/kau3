app.controller("StudentsUniversityCtrl", function($scope, $log, $location, ModelFactory) {
	$log.info("Students By University Controller loaded!");

	$scope.activePath = $location.path();
	var tagCategoryNames = [ 'YR', 'IT', 'IN', 'SS', 'AL', 'GE' ];
	$scope.tagCategories = [];
	/**
	 * Load Categories
	 */
	ModelFactory.getTagCategoriesForNames(tagCategoryNames)//
	.then(function(data) {
		$log.log("data.data", data.data);
		$scope.tagCategories = _.sortBy(data.data, function(cat) {
			return tagCategoryNames.indexOf(cat.name);
		});
	});

	$scope.title = "Students by University";
	$log.log("activePath", $scope.activePath);

});