angular.module('starter.controllers').controller('NearMeLoadCtrl', function ($scope, $state, $cordovaGeolocation, $ionicPlatform, $ionicHistory, $ionicLoading, locationService)
{
  $ionicLoading.show();

  $ionicPlatform.ready(function ()
  {
    if (locationService.getLat() == null)
    {
      console.log("Location Null, Getting Location");
      var posOptions = {timeout: 10000, enableHighAccuracy: true};
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position)
        {
          locationService.setLat(position.coords.latitude)
          locationService.setLong(position.coords.longitude)
          $ionicHistory.nextViewOptions({disableBack: true});
          $ionicLoading.hide();
          $state.go('app.nearMeMap');
        },
        function (err)
        {
          $ionicLoading.hide();
          $ionicLoading.show(
            {
              template: 'Could not find location. Please try again later.',
              duration: 2000
            });
          $ionicHistory.nextViewOptions({disableBack: true});
          $state.go('app.home');
        });
    }
    else
    {
      console.log("Location allready set, redirecting");
      $ionicLoading.hide();
      $ionicHistory.nextViewOptions({disableBack: true});
      $state.go('app.nearMeMap');
    }
  });

});