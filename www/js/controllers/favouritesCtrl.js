angular.module('starter.controllers')
  .controller("favouritesCtrl", function ($scope, $state, $ionicPlatform, shareService, favouritesService, $ionicLoading)
  {
    mixpanel.track("Favorite", {"favorite": 'favouritesCtrl'});
    $scope.favs = favouritesService.getFavourites();

    $scope.$on("$ionicView.enter", function (event, data)//Check to see if the list is empty on form enter.
    {
      $scope.isEmpty();
    })

    $scope.isEmpty = function ()//Shows a message to the user when the list is empty.
    {
      if ($scope.favs.length < 1)
      {
        $ionicLoading.show(
          {
            template: "You have no favourite routes :(",
            duration: 1000
          });
      }
    }

    $scope.removeItem = function (item)//Remove item from the list.
    {
      if (favouritesService.hasItem(item))
      {
        favouritesService.removeItem(item);
        favouritesService.saveFavs();
      }
      $scope.isEmpty();
    }

    $scope.goToFav = function (id)
    {
      shareService.setRouteName(id.route_id);
      $state.go('app.routeStops');
    };
  });
