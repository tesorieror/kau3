/**
 * Tag Filter Module
 */

var TagFilterModule = angular.module('TagFilterModule', []);

TagFilterModule.directive('tagFilter', function() {
	return {
		restrict : 'AEC',
		templateUrl : './tag-filter/tag-filter.html',
		controller : 'TagFilterCtrl',
		scope : {
			categories : '=',
			model : '=',
			onChange : '&filterChanged'
		}
	};
});

TagFilterModule.controller('TagFilterCtrl', function($scope, $log) {
	$log.info('Tag Filter Controller Loaded!');
	$log.log("TagFilterModule model", $scope.model);

	/**
	 * Selection
	 */

	$scope.isSelected = function(cat) {
		return _.reduce(_.values($scope.model[cat._id]), function(result, bool) {
			return result || bool;
		}, false);
	}

	$scope.selectCategoryFirst = function(cat) {
		_.each(cat._tags, function(t) {
			$scope.model[cat._id][t._id] = false;
		});
		$scope.model[cat._id][_.first(_.sortBy(cat._tags, 'order'))._id] = true;
	}

	$scope.unselectCategory = function(cat) {
		_.each(cat._tags, function(t) {
			$scope.model[cat._id][t._id] = false;
		});
	}

	$scope.selectCategory = function(cat) {
		_.each(cat._tags, function(t) {
			$scope.model[cat._id][t._id] = true;
		});
	}

});