angular.module('starter.controllers').controller("NearMeMapCtrl", function ($scope, $state, $ionicHistory, $ionicPlatform, $ionicSideMenuDelegate, stopNearMeService, locationService)
{
  $ionicSideMenuDelegate.canDragContent(false);

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
      lat = locationService.getLat();
      long = locationService.getLong();

      var latLng = new google.maps.LatLng(lat, long);

      var mapOptions =
      {
        center: latLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("nearmemap"), mapOptions);

      //add users current location as a marker
      var myLocation = new google.maps.Marker(
        {
          position: new google.maps.LatLng(lat, long),
          map: map,
          animation: google.maps.Animation.DROP,
          title: "My Location",
          optimized: false
        });

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
        co = data.data;
        //Check if nearby
        for (var i = 0; i < co.length; i++)
        {
          if (co[i].stop_lat < lat + 0.010 &&
              co[i].stop_lat > lat - 0.010 &&
              co[i].stop_lon < long + 0.010 &&
              co[i].stop_lon > long - 0.010)
          {
            createMarker(co[i]);
          }
        }
      });
    })
  }
});