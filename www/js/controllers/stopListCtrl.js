angular.module('starter.controllers').controller("stopListCtrl", function ($scope, shareService, filteredStopService)
{
  $scope.filteredStops = [];
  $scope.route_id = shareService.getRouteName();
  $scope.routeName = shareService.getRouteName();

  var stopPromise = filteredStopService.getFilteredStops($scope.route_id);
  stopPromise.then(function (data)
  {
    $scope.stops = data.data;
    for (var i = 0; i < $scope.stops.length; i++)
    {
      $scope.filteredStops.push($scope.stops[i]);
    }

    $scope.setStopID = function (id)
    {
      $scope.stop_id = id;
      shareService.setStopID($scope.stop_id);
    };
  });
});