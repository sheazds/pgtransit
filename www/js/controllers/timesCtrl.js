angular.module('starter.controllers').controller("timesCtrl", function ($scope, shareService, timesService)
{
    $scope.filteredTimes = [];
    $scope.route_id = shareService.getRouteName();
    $scope.stop_id = shareService.getStopID();

    var stopPromise = timesService.getTimes($scope.route_id);
    stopPromise.then(function (data)
    {
        $scope.times = data.data;
        for (var i = 0; i < $scope.times.length; i++)
        {
            if ($scope.times[i].stop_id == $scope.stop_id)
            {
                $scope.filteredTimes.push($scope.times[i]);
            }
        }
    });
});