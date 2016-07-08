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
