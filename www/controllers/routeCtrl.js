angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller("routeCtrl", function ($scope, routeService, shareService)
  {
    $scope.routes = [];

    var promise = routeService.getRoutes();
    promise.then(function (data1)
    {
      $scope.routes = data1.data;

      $scope.setRoute = function (id)
      {
        $scope.routeID = id;
        shareService.setRouteName($scope.routeID);
      };
    });
  })
