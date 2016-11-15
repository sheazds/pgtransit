angular.module('starter.controllers').controller('ScheduleCtrl', function ($scope, $ionicHistory, $state, routeService, shareService)
{
    $scope.routes = [];

    $scope.gotoSchedule = function()
    {
        $ionicHistory.clearCache().then(function()
        {
            $state.go('app.scheduleTimes');
        })
    }

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
