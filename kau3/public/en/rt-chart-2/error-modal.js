/**
 * New node file
 */
RTChartModule.controller('ErrorModalCtrl', function ($scope, $modalInstance, data) {

  $scope.count = data.count;

  $scope.ok = function () {
    $modalInstance.close(true);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss(false);
  };
});