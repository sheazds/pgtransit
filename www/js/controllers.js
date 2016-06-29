angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout)
{
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

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
