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

DB.controller("DBController", function($scope, $cordovaSQLite)
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

});

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
});
