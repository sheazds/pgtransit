angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout)
{
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
	$scope.storageAvailable = function(type) {
		try {
			var storage = window[type],
				x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		}
		catch(e) {
			return false;
		}
	}
})

	.controller('NearMeLoadCtrl', function($scope, $state, $cordovaGeolocation, $ionicPlatform, $ionicHistory, $ionicLoading, locationService)
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
			  $state.go('app.nearMe');
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
			  $state.go('app.schedule');
			});
		  }
		  else
		  {
			console.log("Location allready set, redirecting");
			$ionicLoading.hide();
			$ionicHistory.nextViewOptions({disableBack: true});
			$state.go('app.nearMe');
		  }
	  });
	})

	.controller("NearMeCtrl", function ($scope, $state, $ionicHistory, stopService, locationService)
	{
	  $scope.loadMap = function()
	  {
		$state.go('app.nearMeMap');
	  };

	  if(locationService.getLat() == null)
	  {
		console.log("Location not set, Ridirecting")
		$ionicHistory.nextViewOptions({disableBack: true});
		$state.go('app.nearMeLoad');
	  }
	  else
	  {
		console.log("Location set")
		$scope.lat = locationService.getLat();
		$scope.long = locationService.getLong();
	  }

		var promise = stopService.getCo();
		promise.then(function (data)
		{
			$scope.co = data.data;
		});
	})

	.controller("NearMeMapCtrl", function ($scope, $state, $ionicHistory, $ionicPlatform, stopService, locationService)
	{
	  //Check if location is set, if not redirect to get it
	  if(locationService.getLat() == null)
	  {
		console.log("Location not set, Ridirecting")
		$ionicHistory.nextViewOptions({disableBack: true});
		$state.go('app.nearMeLoad');
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
		  //NOTE Bounce animation must be used or else marker disappears on android
		  var myLocation = new google.maps.Marker(
		  {
			position: new google.maps.LatLng($scope.lat, $scope.long),
			map: map,
			animation: google.maps.Animation.BOUNCE,
			title: "My Location"
		  });


		  //Add other Bus Stop Markers
		  var infoWindow = new google.maps.InfoWindow();

		  //NOTE Bounce animation must be used or else marker disappears on android
		  var createMarker = function (info)
		  {
			var marker = new google.maps.Marker(
			{
			  position: new google.maps.LatLng(info.stop_lat, info.stop_lon),
			  map: map,
			  animation: google.maps.Animation.BOUNCE,
			  title: info.stop_name,
			  icon: 'http://maps.google.com/mapfiles/ms/micons/bus.png'
			});
			google.maps.event.addListener(marker, 'click', function()
			{
			  infoWindow.setContent(marker.title);
			  infoWindow.open($scope.map, marker)
			});
		  }

		  //Get stops from Json
		  var promise = stopService.getCo();
		  promise.then(function (data)
		  {
			$scope.co = data.data;
			//Check if nearby
			for (i=0; i<$scope.co.length; i++)
			{
			  if( $scope.co[i].stop_lat < $scope.lat + 0.005 &&
				  $scope.co[i].stop_lat > $scope.lat - 0.005 &&
				  $scope.co[i].stop_lon < $scope.long + 0.005 &&
				  $scope.co[i].stop_lon > $scope.long - 0.005)
			  {
				createMarker($scope.co[i]);
			  }
			}
		  });
		})
	  }
	})

	.controller('WeatherCtrl', function($scope, $http, $ionicLoading)
	{
		var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

		$scope.getIconUrl = function(iconId)
		{
			return 'http://openweathermap.org/img/w/' + iconId + '.png';
		};

		$ionicLoading.show();

		//Initialize weather object
		$scope.weather = {"weather":[{"main":"","description":"","icon":""}],"main":{"temp":""},"wind":{"speed":"","deg":""}};
		$scope.forecast = {"list":[{"weather":[{"main":"","description":"","icon":""}],"main":{"temp":""},"wind":{"speed":"","deg":""}}]}

		//check if weather data doesn't exist or is outdated
		$scope.checkWeather = function()
		{
			//If no time data exists or is more then 30 minutes out of date get new data
			if(sessionStorage.getItem('weatherTime') == null || ((new Date().getTime()) - sessionStorage.getItem('weatherTime')) > 900000)
			{
				//Get new weatherdata and store
				console.log("Getting new Weather Data");
				$http.get('http://api.openweathermap.org/data/2.5/weather?id=6113365&units=metric&appid=3d958a8a15a4158a118d8769e70c5461').success(function (response)
				{
					$scope.weather = response;
					sessionStorage.setItem('weatherIcon'		, $scope.weather.weather[0].icon);
					sessionStorage.setItem('weatherMain'		, $scope.weather.weather[0].main);
					sessionStorage.setItem('weatherDescription'	, $scope.weather.weather[0].description);
					sessionStorage.setItem('weatherTemp'		, $scope.weather.main.temp);
					sessionStorage.setItem('weatherSpeed'		, $scope.weather.wind.speed);
					sessionStorage.setItem('weatherDeg'			, $scope.weather.wind.deg);
					sessionStorage.setItem('weatherTime'		, new Date().getTime());
					$ionicLoading.hide();
				}).error(function (err)
				{
					$ionicLoading.show(
						{
							template: 'Could not load weather. Please try again later.',
							duration: 2000
						});
				});
				//Get Forcast
				$http.get('http://api.openweathermap.org/data/2.5/forecast?id=6113365&units=metric&appid=3d958a8a15a4158a118d8769e70c5461').success(function (response)
				{
					$scope.forecast = response;
					sessionStorage.setItem('forecastIcon'		, $scope.forecast.list[0].weather[0].icon);
					sessionStorage.setItem('forecastMain'		, $scope.forecast.list[0].weather[0].main);
					sessionStorage.setItem('forecastDescription', $scope.forecast.list[0].weather[0].description);
					sessionStorage.setItem('forecastTemp'		, $scope.forecast.list[0].main.temp);
					sessionStorage.setItem('forecastSpeed'		, $scope.forecast.list[0].wind.speed);
					sessionStorage.setItem('forecastDeg'		, $scope.forecast.list[0].wind.deg);
					$ionicLoading.hide();
				}).error(function (err)
				{
					$ionicLoading.show(
						{
							template: 'Could not load weather. Please try again later.',
							duration: 2000
						});
				});
			}
			else
			{
				console.log("Weather Data up to date");
				$scope.weather.weather[0].icon 					= sessionStorage.getItem('weatherIcon');
				$scope.weather.weather[0].main 					= sessionStorage.getItem('weatherMain');
				$scope.weather.weather[0].description 			= sessionStorage.getItem('weatherDescription');
				$scope.weather.main.temp 						= sessionStorage.getItem('weatherTemp');
				$scope.weather.wind.speed 						= sessionStorage.getItem('weatherSpeed');
				$scope.weather.wind.deg							= sessionStorage.getItem('weatherDeg');
				$scope.forecast.list[0].weather[0].icon 		= sessionStorage.getItem('forecastIcon');
				$scope.forecast.list[0].weather[0].main 		= sessionStorage.getItem('forecastMain');
				$scope.forecast.list[0].weather[0].description	= sessionStorage.getItem('forecastDescription');
				$scope.forecast.list[0].main.temp 				= sessionStorage.getItem('forecastTemp');
				$scope.forecast.list[0].wind.speed				= sessionStorage.getItem('forecastSpeed');
				$scope.forecast.list[0].wind.deg				= sessionStorage.getItem('forecastDeg');
				$ionicLoading.hide();
			}
		}

		$scope.getDirection = function (degree)
		{
			if (degree > 338)
			{
				degree = 360 - degree;
			}
			var index = Math.floor((degree + 22) / 45);
			return directions[index];
		};
	})
  .controller("stopCtrl", function ($scope, stopService)
  {
    var promise = stopService.getCo();
    promise.then(function (data)
    {
      $scope.co = data.data;
      console.log($scope.co);
    });
  })
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
  			  $state.go('app.schedule');
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
		  //NOTE Bounce animation must be used or else marker disappears on android
		  var myLocation = new google.maps.Marker(
		  {
			position: new google.maps.LatLng($scope.lat, $scope.long),
			map: map,
			animation: google.maps.Animation.BOUNCE,
			title: "My Location"
		  });
		})
	  }
	})

    .controller('WelcomeCtrl', function($scope, $ionicSideMenuDelegate, $state, $ionicHistory, $ionicSlideBoxDelegate)
    {
        $scope.firstLoad = function()
        {
            if(localStorage.getItem('loadToken')!==null)
            {
                $scope.startApp();
            }
        }

        $ionicSideMenuDelegate.canDragContent(false);

        $scope.options = {
            loop: false,
            effect: 'scroll',
            speed: 500,
        };

        $scope.startApp = function()
        {
            localStorage.setItem('loadToken', 'Loaded')
            $ionicSideMenuDelegate.canDragContent(true);
            $ionicHistory.nextViewOptions(
                {
                    disableBack: true
                });
            $state.go('app.schedule');
        };

        $scope.next = function()
        {
            $ionicSlideBoxDelegate.next();
        };

        $scope.previous = function()
        {
            $ionicSlideBoxDelegate.previous();
        };

        $scope.slideChanged = function(index)
        {
            $scope.slideIndex = index;
        };

    })
.controller("DBController", function($scope, $cordovaSQLite)
{

    $scope.insert = function(firstname, lastname)
    {
        var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
        $cordovaSQLite.execute(db, query, [firstname, lastname]).then(function(res)
        {
            console.log("INSERT ID -> " + res.insertId);
        }, function (err)
        {
            console.error(err);
        });
    }

    $scope.select = function(lastname)
    {
        var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
        $cordovaSQLite.execute(db, query, [lastname]).then(function(res)
        {
            if(res.rows.length > 0)
            {
                console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
            } else
            {
                console.log("No results found");
            }
        }, function (err)
        {
            console.error(err);
        });
    }

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
.controller('ContactCtrl', function($scope, $ionicPlatform, $cordovaDevice)
{
  $ionicPlatform.ready(function()
  {
    var device = $cordovaDevice.getDevice();
    $scope.manufacturer = device.manufacturer;
    $scope.model        = device.model;
    $scope.platform     = device.platform;
    $scope.uuid         = device.uuid;
    $scope.version      = device.version;
  })

  document.getElementById("feedbackBtn").addEventListener("click", sendFeedback);

  function sendFeedback()
  {
    window.open("mailto: sheazds@gmail.com"
        + "?subject=PGT - "
        + "&body="
        + encodeURIComponent("\r\n\r\n"
            + "Version Information \r\n"
            + "Manufacturer: "  + $scope.manufacturer + "\r\n"
            + "Model: "         + $scope.model        + "\r\n"
            + "Platform: "      + $scope.platform     + "\r\n"
            + "uuid: "          + $scope.uuid         + "\r\n"
            + "Version: "       + $scope.version      + "\r\n"
        ));
  }
})

.controller('NotificationCtrl', function($scope, $cordovaLocalNotification, $ionicPlatform) {

    $ionicPlatform.ready(function ()
    {

        $scope.scheduleSingleNotification = function ()
        {
        console.log('shit worked');
          $cordovaLocalNotification.schedule({
            id: 1,
            title: 'Notification 1',
            text: 'test notification',
            data: {
              customProperty: 'custom value'
            }
          }).then(function (result) {
            console.log('Notification 1 triggered');
          });
        };
    });
});
