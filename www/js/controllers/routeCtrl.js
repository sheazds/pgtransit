angular.module('starter.controllers').controller("routeCtrl", function ($scope, $state, $ionicLoading, routeService, shareService, favouritesService, $ionicPopup)
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
      mixpanel.track("Route", {"Route Id": $scope.routeID});
      $state.go('app.routeStops');
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

  $scope.routeOnHold = function (c)
  {
    var popUp = $ionicPopup.show({

      title: 'Route options',
      //HTML Template for buttons on popup.
      //Consequently we must write a function to handle button clicks.
      template: '<ion-list> <ion-item ng-click="popUpButtons(1)"> Go to </ion-item> <ion-item ng-click="popUpButtons(2)"> Add to favourites </ion-item> </ion-list>',
      scope: $scope
    })

    popUp.then(function (result)
    {
      console.log('Route context menu opened.')
    })

    $scope.popUpButtons = function (value)
    {
      switch (value)
      {
        case 1:
          popUp.close();
          $scope.setRoute(c.route_id);
          break;
        case 2:
          popUp.close();
          $scope.editFavourite(c);
          break;
        default:
          ;
      }
    }
  }

  //For setting star icon.
  $scope.hasFav = function (c)
  {
    if (favouritesService.hasItem(c))
      return true;
    else
      return false;
  }
});
