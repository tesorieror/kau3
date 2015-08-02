/**
 * New node file
 */
app.directive('tagFilter', function() {
	return {
		restrict : 'AEC',
		templateUrl : 'tag-filter.html',
		controller : 'TagFilterCtrl',
		scope : {
			tagFilterModel : '='
		}
	};
});