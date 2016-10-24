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
          $state.go('app.route');
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

	.controller("NearMeCtrl", function ($scope, $state, $ionicHistory, stopNearMeService, locationService)
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

		var promise = stopNearMeService.getCo();
		promise.then(function (data)
		{
			$scope.co = data.data;
		});
	})

	.controller("NearMeMapCtrl", function ($scope, $state, $ionicHistory, $ionicPlatform, stopNearMeService, locationService)
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
        var myLocation = new google.maps.Marker(
        {
          position: new google.maps.LatLng($scope.lat, $scope.long),
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
          google.maps.event.addListener(marker, 'click', function()
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
					sessionStorage.setItem('weatherIcon'	    	, $scope.weather.weather[0].icon);
					sessionStorage.setItem('weatherMain'	    	, $scope.weather.weather[0].main);
					sessionStorage.setItem('weatherDescription'	, $scope.weather.weather[0].description);
					sessionStorage.setItem('weatherTemp'	    	, $scope.weather.main.temp);
					sessionStorage.setItem('weatherSpeed'	    	, $scope.weather.wind.speed);
					sessionStorage.setItem('weatherDeg'		    	, $scope.weather.wind.deg);
					sessionStorage.setItem('weatherTime'	    	, new Date().getTime());
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
					sessionStorage.setItem('forecastIcon'		    , $scope.forecast.list[0].weather[0].icon);
					sessionStorage.setItem('forecastMain'		    , $scope.forecast.list[0].weather[0].main);
					sessionStorage.setItem('forecastDescription', $scope.forecast.list[0].weather[0].description);
					sessionStorage.setItem('forecastTemp'	    	, $scope.forecast.list[0].main.temp);
					sessionStorage.setItem('forecastSpeed'  		, $scope.forecast.list[0].wind.speed);
					sessionStorage.setItem('forecastDeg'	    	, $scope.forecast.list[0].wind.deg);
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
				$scope.weather.weather[0].icon 			        		= sessionStorage.getItem('weatherIcon');
				$scope.weather.weather[0].main 			        		= sessionStorage.getItem('weatherMain');
				$scope.weather.weather[0].description 	    		= sessionStorage.getItem('weatherDescription');
				$scope.weather.main.temp 			              		= sessionStorage.getItem('weatherTemp');
				$scope.weather.wind.speed 		      		    		= sessionStorage.getItem('weatherSpeed');
				$scope.weather.wind.deg					            		= sessionStorage.getItem('weatherDeg');
				$scope.forecast.list[0].weather[0].icon     		= sessionStorage.getItem('forecastIcon');
				$scope.forecast.list[0].weather[0].main 	    	= sessionStorage.getItem('forecastMain');
				$scope.forecast.list[0].weather[0].description	= sessionStorage.getItem('forecastDescription');
				$scope.forecast.list[0].main.temp 			      	= sessionStorage.getItem('forecastTemp');
				$scope.forecast.list[0].wind.speed		      		= sessionStorage.getItem('forecastSpeed');
				$scope.forecast.list[0].wind.deg			         	= sessionStorage.getItem('forecastDeg');
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
          $state.go('app.route');
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

      $scope.options =
      {
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
          $state.go('app.route');
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
  })

 .controller('LocationSettings', function($scope, $cordovaGeolocation, $ionicPlatform)
 {
     $scope.checkLocation = function()
     {
       cordova.plugins.diagnostic.isLocationEnabled(
                     function(e) {
                         if (e){
                            alert("Location already turned on");
                         }
                         else {
                           alert("Location Not Turned ON");
                           cordova.plugins.diagnostic.switchToLocationSettings();
                         }
                     },
                     function(e) {
                         alert('Error ' + e);
                     }
                 );
     }

     $scope.getLocation = function(){
         $scope.checkLocation();
         $scope.supportsGeo = $window.navigator;
         $scope.position = null;
         $window.navigator.geolocation.getCurrentPosition(function(position) {
                     $scope.$apply(function() {
                         $scope.position = position;
                         var link = "http://maps.google.com/maps?saddr="+$scope.position.coords.latitude+","+$scope.position.coords.longitude+"&daddr="+$scope.address;

                         $window.open(encodeURI(link), '_blank', 'location=no');
                     });
                   }, function(error) {
                       alert(error);
                   },{enableHighAccuracy: true});

         }

 })

.controller('settingsCtrl', function($scope, $cordovaGeolocation, $ionicPlatform, $window)
   {
   $ionicPlatform.ready(function ()
          {
          });

     $scope.pushNotificationChange = function() {
         console.log('Push Notification Change', $scope.pushNotification.checked);
         localStorage.setItem('notification', $scope.pushNotification.checked);
       };

     $scope.pushNotification = { checked: localStorage.getItem('notification') };

     $scope.enableLocationChange = function()
     {
       //localStorage.setItem('locationAccess', $scope.GPS.checked);

        //Fix plugin functionality so we can directly check if the user has enabled the GPS.
       /*cordova.plugins.diagnostic.isLocationEnabled(
         function(available) {
                                      if (available){
                                         //alert("Location already turned on");
                                      }
                                      else {
                                        //alert("Location Not Turned ON");
                                      }
                                  },
                                  function(error) {
                                      console.error("The following error occurred: "+error);
                                  }
                              );*/
       var posOptions = {timeout: 10000, enableHighAccuracy: true};
       $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position)
       {
       },
       function(err)
       {
        $ionicLoading.show(
        {
            template: 'Could not find location. Please try again later.',
            duration: 2000
            });
        $scope.GPS.checked = false;
       });
     }

/*$scope.userName = localStorage.getItem('username');
        $scope.saveName = function()
        {
          localStorage.setItem('username', document.getElementById('userNameBox').value);
        };*/
   })

  .controller("stopCtrl2", function ($scope, stopService1)
  {
    var promise = stopService1.getCo();
    promise.then(function (data)
    {
      $scope.co = data.data;
      console.log($scope.co);
    });
  })

  .controller("routeCtrl", function ($scope, routeService, shareService)
  {
    $scope.routes = [];

    var promise = routeService.getRoutes();
    promise.then(function (data1)
    {
      $scope.routes = data1.data;

      $scope.setRoute = function (id)
      {
        $scope.routeID = id;
        shareService.setRouteName($scope.routeID);
      };
    });
  })

 .controller("stopListCtrl", function ($scope, $state, routeService, stopService, shareService, favouritesService)
  {
    $scope.gotoMap = function()
    {
      $state.go('app.routeMap');
    }

    $scope.addFavourite = function(c)
    {
        favouritesService.setFavourite(c.name);
    }

    $scope.newStopList = [];
    $scope.routeName = shareService.getRouteName();

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
    });
  })

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
