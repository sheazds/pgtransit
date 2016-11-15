angular.module('starter.controllers').controller('ContactCtrl', function ($scope, $ionicPlatform, $cordovaDevice)
{
  mixpanel.track("contact", {"contact": 'ContactCtrl'});
  mixpanel.identify("13487");
  mixpanel.people.set({
    "$first_name": "pg",
    "$last_name": "transit",
    "$created": "2016-09-01T09:02:00",
    "$email": "situ@unbc.ca"
  });
  $ionicPlatform.ready(function ()
  {
    var device = $cordovaDevice.getDevice();
    $scope.manufacturer = device.manufacturer;
    $scope.model = device.model;
    $scope.platform = device.platform;
    $scope.uuid = device.uuid;
    $scope.version = device.version;
  })

  document.getElementById("feedbackBtn").addEventListener("click", sendFeedback);

  function sendFeedback()
  {
    window.open("mailto: sheazds@gmail.com"
      + "?subject=PGT - "
      + "&body="
      + encodeURIComponent("\r\n\r\n"
        + "Version Information \r\n"
        + "Manufacturer: " + $scope.manufacturer + "\r\n"
        + "Model: " + $scope.model + "\r\n"
        + "Platform: " + $scope.platform + "\r\n"
        + "uuid: " + $scope.uuid + "\r\n"
        + "Version: " + $scope.version + "\r\n"
      ));
  }
});