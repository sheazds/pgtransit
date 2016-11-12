angular.module('starter.controllers').controller("RouteStopsCtrl", function ($scope, $state, $ionicHistory, $ionicLoading, shareService, stopService, shapeService)
{
    $scope.gotoSchedule = function()
    {
        $ionicHistory.nextViewOptions({disableBack: true});
        $state.go('app.scheduleTimes');
    }
    $scope.gotoMap = function()
    {
        $ionicHistory.nextViewOptions({disableBack: true});
        $state.go('app.routeMap');
    }


	$scope.stops = [];
	$scope.shapes = [];
	$scope.routeName = shareService.getRouteName();
	$scope.routeShort = shareService.getRouteShort();
	$scope.routeLong = shareService.getRouteLong();

	var promise1 = stopService.getNewstop($scope.routeShort);
    promise1.then(function (data1)
    {
        $scope.stops = data1.data;
    });

    var promise2 = shapeService.getShapes($scope.routeShort);
    promise2.then(function (data2)
    {
        $scope.shapes = data2.data;
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

		var map = new google.maps.Map(document.getElementById("routemap"), mapOptions);

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

		var poly = new google.maps.Polyline(
		{
		    path: $scope.shapes,
		    strokeColor: '#387ef5',
		    strokeOpacity: 0.6,
		    strokeWeight: 2
		}).setMap(map)

	}
});