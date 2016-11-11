angular.module('starter.controllers').controller('MapCtrl', function($scope, $state, $ionicHistory, $ionicPlatform, locationService)
	{
	mixpanel.track("Map", {"map": 'MapCtrl'});
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

        var map = new google.maps.Map(document.getElementById("mapmap"), mapOptions);

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
	});