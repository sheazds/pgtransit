angular.module('starter.controllers').controller("routeCtrl", function ($scope, $state, $ionicLoading, routeService, shareService, favouritesService)
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
            $state.go('app.routeStops');
            mixpanel.track("Route", {"Route Id": $scope.routes});
        };
    })

    $scope.editFavourite = function (c)//Adds/removes favourite route.
    {
        if (favouritesService.hasItem(c))
        {
            favouritesService.removeItem(c);
            favouritesService.saveFavs();
            $ionicLoading.show(
                {
                    template: c.route_short_name + '-' + c.route_long_name + ' removed from favourites.',
                    duration: 750
                });
        }
        else
        {
            favouritesService.setFavourite(c);
            favouritesService.saveFavs();
            $ionicLoading.show(
                {
                    template: c.route_short_name + '-' + c.route_long_name + ' added to favourites.',
                    duration: 750
                });

            //mixpanel.track("Favourite", {"Route ID": c.route_id, "Route Name": c.name});
        }
    };
});
