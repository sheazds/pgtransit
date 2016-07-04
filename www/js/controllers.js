angular.module('starter.controllers', [])

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

});
