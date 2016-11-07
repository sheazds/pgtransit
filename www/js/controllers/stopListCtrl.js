angular.module('starter.controllers').controller("stopListCtrl", function ($scope, $state, routeService, stopService, shareService)
  {

    $scope.gotoMap = function()
    {
      $state.go('app.routeMap');
    }

    $scope.newStopList = [];
    $scope.routeName = shareService.getRouteName();

    var promise = routeService.getRoutes();
    promise.then(function (data1)
    {
       $scope.routes = data1.data;
    });

    var newStop = stopService.getNewstop();
    newStop.then(function (data2)
    {
       $scope.newStop = data2.data;
       for (var i = 0; i < $scope.newStop.length; i++)
       {
         if ($scope.newStop[i].route_id == $scope.routeName)
         {
           $scope.newStopList.push($scope.newStop[i]);

         }
       }
    });
  });