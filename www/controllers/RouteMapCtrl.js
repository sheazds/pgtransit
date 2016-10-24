angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('RouteMapCtrl', function($scope, routeService, stopService, shareService)
  {
    $scope.newStopList = [];

    $scope.routeName = shareService.getRouteName();

    var promise = routeService.getRoutes();
    promise.then(function (data1)
    {
      $scope.routes = data1.data;
    });

    $scope.newStop = stopService.getNewstop();
    $scope.newStop.then(function (data2)
    {
      $scope.newStop = data2.data;
      for (var i = 0; i < $scope.newStop.length; i++)
      {
        if ($scope.newStop[i].route_id == $scope.routeName)
        {
          $scope.newStopList.push($scope.newStop[i]);
        }
      }
      createMap();
    });
    var createMap = function()
    {
      $scope.lat = $scope.newStopList[(Math.floor($scope.newStopList.length/2))].lat;
      $scope.long = $scope.newStopList[(Math.floor($scope.newStopList.length/2))].lng;

      var latLng = new google.maps.LatLng($scope.lat, $scope.long);

      var mapOptions =
      {
        center: latLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Add other Bus Stop Markers
      var infoWindow = new google.maps.InfoWindow();

      var createMarker = function (info)
      {
        var marker = new google.maps.Marker(
        {
          position: new google.maps.LatLng(info.lat, info.lng),
          map: map,
          animation: google.maps.Animation.DROP,
          title: info.name,
          icon: 'http://maps.google.com/mapfiles/ms/micons/bus.png',
          optimized: false
        });
        google.maps.event.addListener(marker, 'click', function()
        {
          infoWindow.setContent(marker.title);
          infoWindow.open($scope.map, marker)
        });
      }

      //Get stops from Json
      for (i=0; i<$scope.newStopList.length; i++)
      {
        createMarker($scope.newStopList[i]);
      }
    }
  });
