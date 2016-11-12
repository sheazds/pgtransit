angular.module('starter.controllers').controller("ScheduleTimesCtrl", function ($scope, $state, $ionicHistory, $ionicLoading, $ionicSideMenuDelegate, shareService, favouritesService, stopService, timeService, shapeService)
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

    $scope.fullStops = [];
	$scope.stops = [];
	$scope.times = [];
	$scope.routeName = shareService.getRouteName();
	$scope.routeShort = shareService.getRouteShort();
	$scope.routeLong = shareService.getRouteLong();

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