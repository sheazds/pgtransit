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

  .controller('CurrentLocationCtrl', function($scope, $cordovaGeolocation, $ionicPlatform)
  {
    $ionicPlatform.ready(function()
    {
      var posOptions = {timeout: 10000, enableHighAccuracy: true};
      $cordovaGeolocation.getCurrentPosition(posOptions)
          .then(function(position)
              {
                $scope.lat  = position.coords.latitude
                $scope.long = position.coords.longitude
              },
              function(err)
              {
                console.log('getCurrentPosition error: ' + angular.toJson(err))
              });
    });
  
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
.controller('MapCtrl', function($scope)
{
  function initMap()
  {
    var map = new google.maps.Map(document.getElementById('map'),
    {
      zoom: 13,
      center: {lat: 53.91706409999999, lng: -122.7496693},
      mapTypeControl: true,
      mapTypeControlOptions:
      {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER
      },
      zoomControl: true,
      zoomControlOptions:
      {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions:
      {
        position: google.maps.ControlPosition.LEFT_TOP
      },
      fullscreenControl: true
    });
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
});
