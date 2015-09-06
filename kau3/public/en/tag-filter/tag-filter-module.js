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

	$scope.$watch("categories", function(newValue, oldValue) {
		$log.log("categories changed!");
		$scope.updateDependencies(null);
	});

	$scope.checkDependency = function(tag) {
		var result = _.any(tag._dependencies, function(dep) {
			return _.all(dep._tags, function(t) {
				return $scope.model[t._category][t._id];
			});
		});

		if (tag.name == 'SIS') {
			console.log(tag._tags);
		}

		return result || tag._dependencies.length == 0;
	}

	$scope.getGroupsFor = function(cat) {
		// $log.log("CAT ID",cat.id);
		var result = [];
		for ( var key in $scope.filteredTags[cat._id]) {
			// $log.log(key);
			result.push($scope.filteredTags[cat._id][key]);
		}

		if (cat.name == 'SP' && result.length > 0) {
			var ids = _.pluck(result[0]._tags, '_id');
			$log.log("Count: ", _.countBy(ids, function(id) {
				return id;
			}));
		}
		return result;
	}

	$scope.updateDependencies = function(changedTag) {
		$log.log("Categories length", $scope.categories.length);
		// console.log("TAG", t);
		$scope.filteredTags = {};
		_.each($scope.categories, function(cat) {
			$scope.filteredTags[cat._id] = {};
			_.each(cat._tags, function(tag) {
				if (tag._dependencies.length > 0) {
					_.each(tag._dependencies, function(dep) {
						var ok = _.all(dep._tags, function(t) {
							return $scope.model[t._category][t._id];
						});

						// $log.log("CAT", cat.name, "TAG", tag.name, "OK", ok);

						if (dep._tags.length == 0) {
							$log.error("_tags empty!", "CAT", cat.name, "TAG", tag.name, "OK", ok);
						}

						// if (ok || dep._tags.length == 0) {
						if (ok) {
							var description = _.reduce(dep._tags, function(acc, t) {
								return acc.concat(t.description).concat(" ");
							}, "");
							var _id = _.reduce(dep._tags, function(acc, t) {
								return acc.concat(t._id).concat(" ");
							}, "");
							// $log.log("KEY", _id, "DESCRIPTION", description, "LEN",
							// dep._tags.length);
							if (!$scope.filteredTags[cat._id][_id]) {
								$scope.filteredTags[cat._id][_id] = {
									description : description,
									_tags : []
								};
								// $log.log("CID", cat._id, "ID", _id,
								// $scope.filteredTags[cat._id][_id]);
							}
							// $log.log("CID", cat._id, "ID", _id,
							// $scope.filteredTags[cat._id][_id]);
							$scope.filteredTags[cat._id][_id]._tags.push(tag);
							// $log.log("CID", cat._id, "ID", _id,
							// $scope.filteredTags[cat._id][_id]);
						}
					});
					// $log.log( cat._id, $scope.filteredTags[cat._id]);
				} else {
					var defaultGroup = " ";
					if (!$scope.filteredTags[cat._id][" "]) {
						$scope.filteredTags[cat._id][" "] = {
							description : " ",
							_tags : []
						};
					}
					$scope.filteredTags[cat._id][" "]._tags.push(tag);
					if (cat.name == "SP") {						
							$log.error("dependences == 0", tag);						
					}
				}
			});
			// $log.log("CID",cat._id,$scope.filteredTags[cat._id]);
			// $log.log("Filtered tags", $scope.filteredTags);
		});
		$log.log("Filtered tags", $scope.filteredTags);
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