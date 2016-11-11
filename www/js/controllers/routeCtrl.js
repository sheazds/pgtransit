angular.module('starter.controllers').controller("routeCtrl", function ($scope, $state, $ionicLoading, $ionicHistory, routeService, shareService, favouritesService)
{
    $scope.routes = [];

    $scope.gotoRoute = function(id)
    {
        shareService.setRouteName(id.route_id);
        shareService.setRouteShort(id.route_short_name);
        shareService.setRouteLong(id.route_long_name);
        mixpanel.track("Route", {"Route Id":$scope.routeID});

        $ionicHistory.clearCache().then(function()
        {
            $state.go('app.routeStops');
        })
    }

    var promise = routeService.getRoutes();
    promise.then(function (data1)
    {
        $scope.routes = data1.data;
    });

    $scope.editFavourite = function(c)//Adds/removes favourite route.
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
