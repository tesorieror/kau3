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
			model : '='
		}
	};
});

TagFilterModule.controller('TagFilterCtrl', function($scope, $log) {
	$log.info('Tag Filter Controller Loaded!');
	$log.log("TagFilterModule model", $scope.model);

	$scope.test = function(cat, tag) {
		$log.log(cat, tag);
	}

	/**
	 * Dependency
	 */

	$scope.checkDependency = function(tag) {
		var result = _.any(tag._tags, function(t) {
			return $scope.model[t._category][t._id];
		});

		if (tag.name == 'SIS') {
			console.log(tag._tags);
		}

		return result || tag._tags.length == 0;
	}

	/**
	 * Input filter
	 */

	$scope.inputFilter = _.reduce(_.keys($scope.model), function(result, catId) {
		result[catId] = '';
		return result;
	}, []);

	/**
	 * Show Filter
	 */

	$scope.showCategory = _.reduce(_.keys($scope.model), function(result, catId) {
		result[catId] = false;
		return result;
	}, []);

	/**
	 * Selection
	 */

	$scope.isSelected = function(cat) {
		return _.reduce(_.values($scope.model[cat._id]), function(result, bool) {
			return result || bool;
		}, false);
	};

	$scope.selectCategoryFirst = function(cat) {
		_.each(cat._tags, function(t) {
			$scope.model[cat._id][t._id] = false;
		});
		$scope.model[cat._id][_.first(_.sortBy(cat._tags, 'order'))._id] = true;
	};

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