angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('MapLoadCtrl', function($scope, $state, $cordovaGeolocation, $ionicPlatform, $ionicHistory, $ionicLoading, locationService)
  {
    $ionicLoading.show();

    $ionicPlatform.ready(function()
    {
      if(locationService.getLat() == null)
      {
      console.log("Location Null, Getting Location");
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position)
        {
          locationService.setLat(position.coords.latitude)
          locationService.setLong(position.coords.longitude)
          $ionicHistory.nextViewOptions({disableBack: true});
          $ionicLoading.hide();
          $state.go('app.map');
        },
        function(err)
        {
          $ionicLoading.hide();
          $ionicLoading.show(
          {
            template: 'Could not find location. Please try again later.',
            duration: 2000
          });
          $ionicHistory.nextViewOptions({disableBack: true});
          $state.go('app.route');
        });
      }
      else
      {
        console.log("Location allready set, redirecting");
        $ionicLoading.hide();
        $ionicHistory.nextViewOptions({disableBack: true});
        $state.go('app.map');
      }
    });
  })

	.controller('MapCtrl', function($scope, $state, $ionicHistory, $ionicPlatform, locationService)
	{
	  //Check if location is set, if not redirect to get it
	  if(locationService.getLat() == null)
	  {
      console.log("Location not set, Ridirecting")
      $ionicHistory.nextViewOptions({disableBack: true});
      $state.go('app.mapLoad');
	  }
	  //If location is set generate map
	  else
	  {
      $ionicPlatform.ready(function()
      {
        $scope.lat = locationService.getLat();
        $scope.long = locationService.getLong();

        var latLng = new google.maps.LatLng($scope.lat, $scope.long);

        var mapOptions =
        {
          center: latLng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        //add users current location as a marker
        var myLocation = new google.maps.Marker(
        {
          position: new google.maps.LatLng($scope.lat, $scope.long),
          map: map,
          animation: google.maps.Animation.DROP,
          title: "My Location",
          optimized: false
        });
      })
	  }
	})
