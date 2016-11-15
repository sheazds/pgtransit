angular.module('starter.controllers').controller("NearMeMapCtrl", function ($scope, $state, $ionicHistory, $ionicPlatform, stopNearMeService, locationService)
{
  //Check if location is set, if not redirect to get it
  if (locationService.getLat() == null)
  {
    console.log("Location not set, Ridirecting")
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go('app.nearMeLoad');
  }
  //If location is set generate map
  else
  {
    $ionicPlatform.ready(function ()
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
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Add other Bus Stop Markers
      var infoWindow = new google.maps.InfoWindow();

      var createMarker = function (info)
      {
        var marker = new google.maps.Marker(
          {
            position: new google.maps.LatLng(info.stop_lat, info.stop_lon),
            map: map,
            animation: google.maps.Animation.DROP,
            title: info.stop_name,
            icon: 'http://maps.google.com/mapfiles/ms/micons/bus.png',
            optimized: false
          });

        google.maps.event.addListener(marker, 'click', function ()
        {
          infoWindow.setContent(marker.title);
          infoWindow.open($scope.map, marker)
        });
      }

      //Get stops from Json
      var promise = stopNearMeService.getCo();
      promise.then(function (data)
      {
        $scope.co = data.data;
        //Check if nearby
        for (i = 0; i < $scope.co.length; i++)
        {
          if ($scope.co[i].stop_lat < $scope.lat + 0.010 &&
            $scope.co[i].stop_lat > $scope.lat - 0.010 &&
            $scope.co[i].stop_lon < $scope.long + 0.010 &&
            $scope.co[i].stop_lon > $scope.long - 0.010)
          {
            createMarker($scope.co[i]);
          }
        }
      });
    })
  }
});