angular.module('starter.controllers').controller("NearMeCtrl", function ($scope, $state, $ionicHistory, stopNearMeService, locationService)
{


    $scope.loadMap = function ()
    {
        $state.go('app.nearMeMap');
    };

    if (locationService.getLat() == null)
    {
        console.log("Location not set, Ridirecting")
        $ionicHistory.nextViewOptions({disableBack: true});
        $state.go('app.nearMeLoad');
    }
    else
    {
        console.log("Location set")
        $scope.lat = locationService.getLat();
        $scope.long = locationService.getLong();
    }

    var promise = stopNearMeService.getCo();
    promise.then(function (data)
    {
        $scope.co = data.data;

    });
});