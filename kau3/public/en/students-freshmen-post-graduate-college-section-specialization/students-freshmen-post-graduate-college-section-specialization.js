app.controller("StudentsFreshmenPostGraduateCollegeSectionSpecializationCtrl",
		function($scope, $log, $location, ModelFactory) {
			$log.info("Freshmen Post Graduate Students by College Section Specialization Controller loaded!");
			$scope.activePath = $location.path();
			// YR,SS,DS,GR,IT,IN,CO,SE,SP,NA,GE
			var tagCategoryNames = [ 'YR', 'SS', 'DS', 'GR', 'IT', 'IN', 'CO', 'SE', 'SP', 'NA', 'GE' ];
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
				$log.log("tagCategories", $scope.tagCategories);

			});

			$scope.title = "Freshmen Post Graduate Students by College Section Specialization";
			$log.log("activePath", $scope.activePath);
		});