(function(){
var app = angular.module('app', ['ionic', 'ngCordova']);

app.controller('CurrentLocationCtrl', function($scope, $cordovaGeolocation, $ionicPlatform)
{
    $ionicPlatform.ready(function()
    {
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation.getCurrentPosition(posOptions)
          .then(function(position) {
           $scope.coords = position.coords;
                }, function(err) {
                 console.log('getCurrentPosition error: ' + angular.toJson(err))
                });
    });

});


app.run(function($ionicPlatform)
  {
  $ionicPlatform.ready(function()
    {

    });
  });
}()
);
