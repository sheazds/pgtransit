angular.module('starter.controllers').controller("ScheduleTimesCtrl", function ($scope, $state, $ionicHistory, $ionicLoading, $ionicSideMenuDelegate, shareService, favouritesService, stopService, timeService, shapeService, scheduleService)
{
  $ionicSideMenuDelegate.canDragContent(false);

  $scope.gotoRoute = function()
  {
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go('app.routeStops');
  }
  $scope.gotoMap = function()
  {
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go('app.routeMap');
  }

  $scope.setRouteType = function(type)
  {
    if(type != null) $scope.routeType = $scope.routeShort + type
    else $scope.routeType = $scope.routeShort
    shareService.setRouteType($scope.routeType);
    mixpanel.track("RouteType", {"Route Type":$scope.routeType});

    $ionicHistory.clearCache([$state.current.name]).then(function()
    {
      $state.reload();
    });

  };

  $scope.fullStops = [];
  $scope.stops = [];
  $scope.times = [];
  $scope.schedule = [];
  $scope.routeName = shareService.getRouteName();
  $scope.routeShort = shareService.getRouteShort();
  $scope.routeLong = shareService.getRouteLong();
  $scope.routeType = shareService.getRouteType();

  //Indicates which route has what types of stops
  var routeTypesIndex = [1, 5, 11, 15, 16, 17, 18, 46, 47, 55, 88, 89, 91, 96, 97];
  $scope.routeTypes = [/*1*/["sa","su"], /*5*/["sa"], /*11*/["sa","su"],
                      /*15*/["rv","sa","su"], /*16*/["sa","su"], /*17*/[],
                      /*18*/[], /*46*/["sa","su"], /*47*/[],
                      /*55*/["sa","su"], /*88*/["sa","su"], /*89*/["sa","su"],
                       /*91*/["rv","sa","su"], /*96*/[], /*97*/[]];

  $scope.ri = routeTypesIndex.indexOf($scope.routeShort);

  //If page is blank go home
  if($scope.routeName == null)
  {
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go('app.home');
  }

  var promise1 = stopService.getNewstop($scope.routeShort);
  promise1.then(function (data1)
  {
    $scope.fullStops = data1.data;
    for (i=0; i < $scope.fullStops.length; i++)
    {
      if($scope.fullStops[i].location_type == 1)
      {
        $scope.stops.push($scope.fullStops[i]);
      }
    }
  });

	var promise2 = timeService.getNewstop($scope.routeShort);
  promise2.then(function (data2)
  {
    $scope.times = data2.data;
  });

  var promise4 = scheduleService.getSchedule($scope.routeType);
  promise4.then(function (data4)
  {
    $scope.schedule = data4.data;
  })

  var promise3 = shapeService.getShapes($scope.routeShort);
  promise3.then(function (data3)
  {
    $scope.shapes = data3.data;
    createMap();
  })

  var createMap = function()
  {
    $scope.lat = 0;
    $scope.lon = 0;
    for (i=0; i < $scope.stops.length; i++)
    {
      $scope.lat = $scope.lat + $scope.stops[i].stop_lat;
      $scope.lon = $scope.lon + $scope.stops[i].stop_lon;
    }
    $scope.lat = $scope.lat / $scope.stops.length;
    $scope.lon = $scope.lon / $scope.stops.length;
  
    var latLon = new google.maps.LatLng($scope.lat, $scope.lon);
  
    var mapOptions =
    {
      center: latLon,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      liteMode: true,
      disableDefaultUI: true
    }

    var map = new google.maps.Map(document.getElementById("schedulemap"), mapOptions);
  
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
      google.maps.event.addListener(marker, 'click', function()
      {
        infoWindow.setContent(marker.title);
        infoWindow.open($scope.map, marker)
      });
    }
    //Get stops from Json
    for (i=0; i < $scope.stops.length; i++)
    {
      createMarker($scope.stops[i]);
    }
  
    var poly = new google.maps.Polyline(
    {
      path: $scope.shapes,
      strokeColor: '#387ef5',
      strokeOpacity: 0.6,
      strokeWeight: 2
    }).setMap(map)
  }

  $scope.editFavourite = function(stop)//Adds/removes favourite route.
  {
    if (favouritesService.hasItem(stop))
    {
      favouritesService.removeItem(stop);
      favouritesService.saveFavs();
      $ionicLoading.show(
      {
        template: stop.stop_name + ' removed from favourites.',
        duration: 1000
      })
    }
    else
    {
      favouritesService.setFavourite(stop);
      favouritesService.saveFavs();
      $ionicLoading.show(
      {
        template: stop.stop_name + ' added to favourites.',
        duration: 1000
      });
    }
  };
});