angular.module('starter.controllers').controller("routeCtrl", function ($scope, routeService, shareService)
  {
    $scope.routes = [];

    var promise = routeService.getRoutes();
    promise.then(function (data1)
    {
      $scope.routes = data1.data;

      $scope.setRoute = function (id, shortName, longName)
      {
        $scope.routeID = id;
        $scope.routeShortName = shortName;
        $scope.routeLongName = longName;
        shareService.setRouteName($scope.routeID);
        shareService.setRouteShort($scope.routeShortName);
        shareService.setRouteLong($scope.routeLongName);
      };
    });
  });
