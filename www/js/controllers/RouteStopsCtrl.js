angular.module('starter.controllers').controller("RouteStopsCtrl", function ($scope, $state, $ionicLoading, routeService, stopService, shareService, favouritesService)
{
	$scope.gotoMap = function()
	{
	 $state.go('app.routeMap');
	}

	$scope.editFavourite = function(c)//Adds/removes favourite route.
	{
		if (favouritesService.hasItem(c))
		{
			favouritesService.removeItem(c);
			favouritesService.saveFavs();
			$ionicLoading.show(
			{
				template: c.name + ' removed from favourites.',
				duration: 1000
			})
		}
		else
		{
			favouritesService.setFavourite(c);
			favouritesService.saveFavs();
			$ionicLoading.show(
			{
				template: c.name + ' added to favourites.',
				duration: 1000
			});
		}
	};

	 $scope.newStopList = [];
	 $scope.routeName = shareService.getRouteName();
	 $scope.routeShort = shareService.getRouteShort();
	 $scope.routeLong = shareService.getRouteLong();

	var promise = routeService.getRoutes();
	promise.then(function (data1)
	{
		$scope.routes = data1.data;
	});

	var newStop = stopService.getNewstop();
	newStop.then(function (data2)
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
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			liteMode: true,
			disableDefaultUI: true
		}

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